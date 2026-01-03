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
				GridUi.left.set([ HtmlVideo.local(stream) ])
			})

		SocketClient.onClientMessage('INCOMING_CALL', data => {
			this.onIncomingCall(data.originClientId, data.offer)
		})

		SocketClient.onClientMessage('CALL_ACCEPTED', data => {
			const connection = this.connectedClientIds[data.originClientId]
			if (!connection) {
				throw new Error('could not find connection')
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

		SocketClient.onClientMessage('ICE_CANDIDATE', data => {
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
			else {
				throw new Error('could not find incoming connection')
			}
		})
	}

	static call(targetClientId) {
		if (this.connectedClientIds[targetClientId]) {
			throw new Error('you can\'t call someone you already have a connection with')
		}

		const { peerConnection, dataChannel } =
			this.createPeerConnection(targetClientId, true)

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
					'INCOMING_CALL',
					targetClientId,
					{ offer: peerConnection.localDescription }
				)
			})
	}

	static acceptIncomingCall(callerClientId, offer) {
		if (this.connectedClientIds[callerClientId]) {
			return
		}

		const { peerConnection, dataChannel } = this.createPeerConnection(callerClientId, false)

		this.connectedClientIds[callerClientId] = {
			peerConnection,
			dataChannel
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
					'CALL_ACCEPTED',
					callerClientId,
					{ answer: peerConnection.localDescription })
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

	static createPeerConnection(targetClientId, isCaller) { // using booleans in a method is really bad. refactor!
		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		})

		peerConnection.ontrack = e => {
			const stream = e.streams[0]
			if (this.remoteStreamIds.has(stream.id)) {
				return
			}

			this.remoteStreamIds.add(stream.id)
			GridUi.left.push(HtmlVideo.guest(stream))
		}

		peerConnection.onicecandidate = e => {
			if (!e.candidate) {
				return // should it throw error here? why is it only returning?
			}

			SocketClient.sendToClient(
				'ICE_CANDIDATE',
				targetClientId,
				{ candidate: e.candidate }
			)
		}

		let dataChannel = null // this code looks scary.
		// if isCaller is true, should it return #1 or #2 ?
		// right now it seems like if isCaller is false it might return null
		// does peerConnection.ondatachannel execute immediately?

		if (isCaller) {
			dataChannel = peerConnection.createDataChannel('data') // #1
			this.setupDataChannel(dataChannel)
		}

		peerConnection.ondatachannel = e => {
			dataChannel = e.channel // #2

			this.setupDataChannel(dataChannel)

			if (this.connectedClientIds[targetClientId]) {
				this.connectedClientIds[targetClientId].dataChannel = dataChannel
			}
		}

		return { peerConnection, dataChannel }
	}

	static setupDataChannel(dataChannel) {
		dataChannel.onmessage = e => {
			console.log('Received message:', e.data)
			this.onData(JSON.parse(e.data))
		}

		dataChannel.onopen = () => {
			console.log('Data channel opened')
		}

		dataChannel.onerror = (error) => {
			console.error('Data channel error:', error)
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
