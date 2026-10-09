export class RtcClient {
	static {
		this.connectedUserIds = {}
		this.remoteStreamIds = new Set()

		this.onData = (json) => {}
		this.onIncomingCall = (callerUserId, offer) => {}
		this.onCallAccepted = (userId) => {}

		this.localStream = null
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then(stream => {
				this.localStream = stream
				Dom.add([ HtmlVideo.local(stream) ])
			})

		SocketClient.onClientMessage("INCOMING_CALL", ({ data, metaHeaders }) => {
			this.onIncomingCall(metaHeaders.originUserId, data.offer)
		})

		SocketClient.onClientMessage("CALL_ACCEPTED", ({ data, metaHeaders }) => {
			const connection = this.connectedUserIds[metaHeaders.originUserId]
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

				this.onCallAccepted(metaHeaders.originUserId)
			}
		})

		SocketClient.onClientMessage("ICE_CANDIDATE", ({ data, metaHeaders }) => {
			const connection = this.connectedUserIds[metaHeaders.originUserId]
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

	static call(targetUserId) {
		if (this.connectedUserIds[targetUserId]) {
			throw new Error("you can't call someone you already have a connection with")
		}

		const { peerConnection, dataChannel } = this.makeOffer(targetUserId)

		this.connectedUserIds[targetUserId] = {
			peerConnection,
			dataChannel
		}

		this.localStream.getTracks().forEach(track =>
			peerConnection.addTrack(track, this.localStream)
		)

		peerConnection.createOffer()
			.then(offer => peerConnection.setLocalDescription(offer))
			.then(() => {
				SocketClient.sendToUser(
					"INCOMING_CALL",
					targetUserId,
					{ offer: peerConnection.localDescription }
				)
			})
	}

	static acceptIncomingCall(callerUserId, offer) {
		if (this.connectedUserIds[callerUserId]) {
			return
		}

		const peerConnection = this.createPeerConnection(callerUserId)

		this.connectedUserIds[callerUserId] = {
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
				SocketClient.sendToUser(
					"CALL_ACCEPTED",
					callerUserId,
					{ answer: peerConnection.localDescription })
			}).then(() => {
				peerConnection.ondatachannel = e => {
					if (this.connectedUserIds[callerUserId]) {
						this.connectedUserIds[callerUserId].dataChannel = e.channel
						this.setupDataChannel(e.channel)
					}
					else {
						throw new Error(`${callerUserId} Is Not Connected`)
					}
				}
			})
			.then(() => {
				this.onCallAccepted(callerUserId)
			})
	}

	static send(targetUserId, data) {
		const connection = this.connectedUserIds[targetUserId]
		if (!connection.dataChannel) {
			throw new Error(`Data Channel Not Found For ${targetUserId}`)
		}

		connection.dataChannel.send(JSON.stringify(data))
	}

	static createPeerConnection(targetUserId) {
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

			SocketClient.sendToUser(
				"ICE_CANDIDATE",
				targetUserId,
				{ candidate: e.candidate }
			)
		}

		peerConnection.oniceconnectionstatechange = () => {
			console.log("oniceconnectionstatechange")
			console.log(targetUserId, peerConnection.iceConnectionState)
		}

		peerConnection.onconnectionstatechange = () => {
			console.log("onconnectionstatechange")
			console.log("Connection:", peer.connectionState)
		}

		return peerConnection
	}

	static makeOffer(targetUserId) {
		const peerConnection = this.createPeerConnection(targetUserId)
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
		for (const userId in this.connectedUserIds) {
			this.connectedUserIds[userId].peerConnection.close()
		}

		this.connectedUserIds = {}
		this.remoteStreamIds.clear()
	}
}
