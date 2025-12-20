export class RtcClient {
	constructor() {
		this.socketClient = new SocketClient()
		this.peers = {}
		this.localStream = null
		this.onData = null

		this.socketClient.on(json => {
			const data = json.data
			let peerConn = this.peers[data.fromClientId]

			switch (json.rtc_action) {
			case 'CALL':
				console.log(`Incoming call from ${data.fromClientId}`)
				break
			case 'OFFER':
				this.acceptCall(data.fromClientId, data.offer)
				break
			case 'ANSWER':
				if (peerConn && typeof peerConn.setRemoteDescription === 'function') {
					peerConn.setRemoteDescription(new RTCSessionDescription(data.answer)).catch(err => {
						console.warn('setRemoteDescription failed:', err)
					})
				}
				else {
					console.warn('ANSWER received but no valid RTCPeerConnection found for', data.fromClientId)
				}
				break
			case 'ICE_CANDIDATE':
				if (peerConn && typeof peerConn.addIceCandidate === 'function') {
					peerConn.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(err => {
						console.warn('addIceCandidate failed:', err)
					})
				}
				else {
					console.warn('ICE_CANDIDATE received but no valid RTCPeerConnection found for', data.fromClientId)
				}
				break
			}
		})
	}

	call(targetClientId) {
		const { peerConnection, dataChannel } = this.createPeer(targetClientId)
		this.peers[targetClientId] = { peerConnection, dataChannel }

		this.localStream.getTracks().forEach(track => {
			peerConnection.addTrack(track, this.localStream)
		})

		peerConnection.createOffer()
			.then(offer => peerConnection.setLocalDescription(offer))
			.then(() => {
				this.socketClient.send(targetClientId, {
					rtc_action: 'OFFER',
					data: {
						fromClientId: this.socketClient.clientId,
						offer: peerConnection.localDescription
					}
				})
			})
	}

	acceptCall(fromClientId, offer) {
		const { peerConnection, dataChannel } = this.createPeer(fromClientId)
		this.peers[fromClientId] = { peerConnection, dataChannel }

		peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
			.then(() => this.localStream.getTracks().forEach(track => {
				peerConnection.addTrack(track, this.localStream)
			}))
			.then(() => peerConnection.createAnswer())
			.then(answer => peerConnection.setLocalDescription(answer))
			.then(() => {
				this.socketClient.send(fromClientId, {
					rtc_action: 'ANSWER',
					data: {
						fromClientId: this.socketClient.clientId,
						answer: peerConnection.localDescription
					}
				})
			})
	}

	send(targetClientId, data) {
		this.peers[targetClientId].dataChannel.send(JSON.stringify(data))
	}

	createPeer(peerId) {
		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		})

		peerConnection.ontrack = () => {
			// Handle remote stream
		}

		peerConnection.onicecandidate = e => {
			if (e.candidate) {
				this.socketClient.send(peerId, {
					rtc_action: 'ICE_CANDIDATE',
					data: {
						fromClientId: this.socketClient.clientId,
						candidate: e.candidate
					}
				})
			}
		}



		const dataChannel = peerConnection.createDataChannel('data')
		dataChannel.onopen = () => console.log('Data channel opened')
		dataChannel.onmessage = (e) => {
			if (this.onData) {
				this.onData(JSON.parse(e.data))
			}
		}
		peerConnection.ondatachannel = (e) => {
			const channel = e.channel
			channel.onopen = () => console.log('Data channel opened')
			channel.onmessage = (e) => {
				if (this.onData) {
					this.onData(JSON.parse(e.data))
				}
			}
		}

		return { peerConnection, dataChannel }
	}

	startLocalStream() {
		return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => {
				this.localStream = stream
				return stream
			})
	}

	stopCall() {
		for (const peerId in this.peers) {
			this.peers[peerId].close()
		}
		this.peers = {}
	}
}
