// ClientId(

export class RtcClient {
	static {
		this.connectedClientIds = {}
		this.remoteStreamIds = new Set()

		this.onData = (json) => {}
		this.onIncomingCall = (callerClientId, offer) => {}
		this.onCallAccepted = (clientId) => {}

		this.localStream = null
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then(stream => {
				this.localStream = stream
				GridTemplate.left.set([ HtmlVideo.local(stream) ])
			})

		SocketClient.onClientMessage("INCOMING_CALL", data => {
			this.onIncomingCall(data.originClientId, data.offer)
		})

		SocketClient.onClientMessage("CALL_ACCEPTED", data => {
			const connection = this.connectedClientIds[data.originClientId]
			if (!connection) {
				throw new Error("could not find connection")
			}
			else {
				connection.peerConnection
					.setRemoteDescription(
						new RTCSessionDescription(data.answer)
					)
					.catch(e => {
						throw new Error(e)
					})

				this.onCallAccepted(data.originClientId)
			}
		})

		SocketClient.onClientMessage("ICE_CANDIDATE", data => {
			const connection = this.connectedClientIds[data.originClientId]
			if (connection) {
				connection.peerConnection
					.addIceCandidate(
						new RTCIceCandidate(data.candidate)
					)
					.catch(e => {
						throw new Error(e)
					})
			}
		})
	}

	static call(targetClientId) {
		if (this.connectedClientIds[targetClientId]) {
			throw new Error("you can't call someone you already have a connection with")
		}

		const { peerConnection, dataChannel } = this.makeOffer(targetClientId)

		this.connectedClientIds[targetClientId] = {
			peerConnection,
			dataChannel
		}

		this.localStream.getTracks().forEach(track =>
			peerConnection.addTrack(track, this.localStream)
		)

		peerConnection.createOffer()
			.then(offer => peerConnection.setLocalDescription(offer))
			.then(() => {
				SocketClient.sendToClient(
					"INCOMING_CALL",
					targetClientId,
					{ offer: peerConnection.localDescription }
				)
			})
	}

	static acceptIncomingCall(callerClientId, offer) {
		if (this.connectedClientIds[callerClientId]) {
			return
		}

		const peerConnection = this.createPeerConnection(callerClientId)

		this.connectedClientIds[callerClientId] = {
			peerConnection,
			dataChannel: null
		}

		peerConnection
			.setRemoteDescription(new RTCSessionDescription(offer))
			.then(() => {
				this.localStream.getTracks().forEach(track => {
					peerConnection.addTrack(track, this.localStream)
				})
			})
			.then(() => peerConnection.createAnswer())
			.then(answer => peerConnection.setLocalDescription(answer))
			.then(() => {
				SocketClient.sendToClient(
					"CALL_ACCEPTED",
					callerClientId,
					{ answer: peerConnection.localDescription })
			}).then(() => {
				peerConnection.ondatachannel = e => {
					if (this.connectedClientIds[callerClientId]) {
						this.connectedClientIds[callerClientId].dataChannel = e.channel
						this.setupDataChannel(e.channel)
					}
					else {
						throw new Error(`${callerClientId} Is Not Connected`)
					}
				}
			})
			.then(() => {
				this.onCallAccepted(callerClientId)
			})
	}

	static send(targetClientId, data) {
		const connection = this.connectedClientIds[targetClientId]
		if (!connection.dataChannel) {
			throw new Error(`Data Channel Not Found For ${targetClientId}`)
		}

		connection.dataChannel.send(JSON.stringify(data))
	}

	static createPeerConnection(targetClientId) {
		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
		})

		peerConnection.ontrack = e => {
			const stream = e.streams[0]
			if (this.remoteStreamIds.has(stream.id)) {
				return
			}

			this.remoteStreamIds.add(stream.id)
			GridTemplate.left.push(HtmlVideo.guest(stream))
		}

		peerConnection.onicecandidate = e => {
			if (!e.candidate) {
				return
			}

			SocketClient.sendToClient(
				"ICE_CANDIDATE",
				targetClientId,
				{ candidate: e.candidate }
			)
		}

		return peerConnection
	}

	static makeOffer(targetClientId) {
		const peerConnection = this.createPeerConnection(targetClientId)
		const dataChannel = peerConnection.createDataChannel("data")

		this.setupDataChannel(dataChannel)

		return { peerConnection, dataChannel }
	}

	static setupDataChannel(dataChannel) {
		dataChannel.onmessage = e => {
			console.log("Received message:", e.data)
			this.onData(JSON.parse(e.data))
		}

		dataChannel.onopen = () => {
			console.log("Data channel opened")
		}

		dataChannel.onerror = (error) => {
			console.error("Data channel error:", error)
		}
	}

	static stopCall() {
		for (const clientId in this.connectedClientIds) {
			this.connectedClientIds[clientId].peerConnection.close()
		}

		this.connectedClientIds = {}
		this.remoteStreamIds.clear()
	}
}

window.RtcClient = RtcClient
