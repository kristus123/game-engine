// ClientId(

export class RtcClient {
	static {
		this.connections = {}
		this.pendingOffers = {}
		this.localStream = null
		this.remoteStreamIds = new Set()

		this.onData = () => {}
		this.onIncomingCall = () => {}
		this.onCallAccept = () => {}

		this.startLocalStream()

		SocketClient.onClientMessage('INCOMING_CALL', data => {
			this.pendingOffers[data.originClientId] = data.offer
			this.onIncomingCall(data.originClientId)
		})

		SocketClient.onClientMessage('ACCEPT_INCOMING_CALL', data => {
			const connection = this.connections[data.originClientId]
			if (!connection) {
				return
			}

			connection.peerConnection
				.setRemoteDescription(
					new RTCSessionDescription(data.answer)
				)
				.catch(console.warn)
			this.onCallAccept(data.originClientId)
		})

		SocketClient.onClientMessage('ICE_CANDIDATE', data => {
			const connection = this.connections[data.originClientId]
			if (!connection) {
				return
			}

			connection.peerConnection
				.addIceCandidate(
					new RTCIceCandidate(data.candidate)
				)
				.catch(console.warn)
		})
	}

	static call(targetClientId) {
		if (this.connections[targetClientId]) {
			return
		}

		const { peerConnection, dataChannel } =
			this.createPeerConnection(targetClientId, true)

		this.connections[targetClientId] = {
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

	static acceptCall(callerClientId) {
		if (this.connections[callerClientId]) {
			return
		}

		const { peerConnection, dataChannel } = this.createPeerConnection(callerClientId, false)

		this.connections[callerClientId] = {
			peerConnection,
			dataChannel
		}

		peerConnection
			.setRemoteDescription(
				new RTCSessionDescription(
					this.pendingOffers[callerClientId]
				)
			)
			.then(() => {
				this.localStream.getTracks().forEach(track =>
					peerConnection.addTrack(track, this.localStream)
				)
			})
			.then(() => peerConnection.createAnswer())
			.then(answer => peerConnection.setLocalDescription(answer))
			.then(() => {
				SocketClient.sendToClient(
					'ACCEPT_INCOMING_CALL',
					callerClientId,
					{ answer: peerConnection.localDescription }
				)
			})
			.then(() => {
				this.onCallAccept(callerClientId)
			})
	}

	static send(targetClientId, data) {
		const connection = this.connections[targetClientId]
		if (!connection.dataChannel) {
			throw new Error(`Data Channel Not Found For ${targetClientId}`)
		}

		connection.dataChannel.send(JSON.stringify(data))
	}

	static createPeerConnection(targetClientId, isCaller) {
		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		})

		peerConnection.ontrack = event => {
			const stream = event.streams[0]
			if (this.remoteStreamIds.has(stream.id)) {
				return
			}

			this.remoteStreamIds.add(stream.id)
			GridUi.left.push(HtmlVideo.guest(stream))
		}

		peerConnection.onicecandidate = event => {
			if (!event.candidate) {
				return
			}

			SocketClient.sendToClient(
				'ICE_CANDIDATE',
				targetClientId,
				{ candidate: event.candidate }
			)
		}

		let dataChannel = null

		if (isCaller) {
			dataChannel = peerConnection.createDataChannel('data')
			this.setupDataChannel(dataChannel)
		}

		peerConnection.ondatachannel = event => {
			dataChannel = event.channel

			this.setupDataChannel(dataChannel)

			if (this.connections[targetClientId]) {
				this.connections[targetClientId].dataChannel = dataChannel
			}
		}

		return { peerConnection, dataChannel }
	}

	static startLocalStream() {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then(stream => {
				this.localStream = stream
				GridUi.left.set([ HtmlVideo.local(stream) ])
			})
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
		for (const clientId in this.connections) {
			this.connections[clientId].peerConnection.close()
		}

		this.connections = {}
		this.remoteStreamIds.clear()
	}
}

window.RtcClient = RtcClient
