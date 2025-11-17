export class VideoCall {
	constructor() {
		this.localStream
		this.targetClientId
		this.originClientId
		this.peerConnection = {}
		this.startCall()
		this.connectedClientId = []

		this.div = Html.right([
		])

		this.socketClient = new SocketClient(8082, c => {

			c.on('RTC_CLIENT_INFO', data => {
				this.targetClientId = data.originClientId
			})

			c.on('RTC_CLIENT_CONNECTED', data => {
				for (let i = 0; i < this.connectedClientId.length; i++) {
					const id = this.connectedClientId[i]
					if (id == data.targetClientId) {
						console.warn('found')
						return
					}
				}

				if (this.targetClientId == data.targetClientId) {
					return
				}

				this.connectedClientId.push(data.targetClientId)
				const checkForConnection = setInterval(() => {
					if (this.localStream != undefined) {
						clearInterval(checkForConnection)
					}

					const peerConnection = this.createPeerConnection(data.targetClientId)
					this.peerConnection[data.targetClientId] = peerConnection

					this.localStream.getTracks().forEach(track => {
						peerConnection.addTrack(track, this.localStream)
					})

					peerConnection.createOffer()
						.then(offer => peerConnection.setLocalDescription(offer))
						.then(() => {
							console.warn(data.targetClientId + ' offer send')
							this.socketClient.send({
								action: 'RTC_OFFER',
								offer: peerConnection.localDescription,
								targetClientId: data.targetClientId
							})
						})
				}, 100)
			})

			c.on('RTC_OFFER', data => {
				console.warn(data.targetClientId + ' offer recived')
				this.originClientId = data.originClientId

				console.warn('from '+this.originClientId)
				const peerConnection = this.createPeerConnection(data.targetClientId)
				if (!peerConnection) {
					startCall()
					console.warn('Star')
				}

				this.peerConnection[data.targetClientId] = peerConnection
				peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
					.then(() => peerConnection.createAnswer())
					.then(answer => peerConnection.setLocalDescription(answer))
					.then(() => {
						console.warn(data.targetClientId+' answer send')

						this.socketClient.send({
							action: 'RTC_ANSWER',
							answer: peerConnection.localDescription,
							targetClientId: data.targetClientId,
							originClientId: this.originClientId
						})
					})
					.catch(error => {
						console.error('Error handling offer', error)
					})
			})

			c.on('RTC_ANSWER', data => {
				console.warn(data.targetClientId+' answer recived from '+data.originClientId)
				console.warn(data.answer)
				this.socketClient.send({
					action: 'RTC_CLIENT_CONNECTED',
					targetClientId: data.targetClientId,
					connectedClientId: this.connectedClientId
				})
				const peerConnection = this.peerConnection[data.targetClientId]
				peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
					.catch((error) => {
						console.error('Error setting remote description from answer', error)
					})
			})

			c.on('RTC_ICE_CANDIDATE', data => {
				console.warn(data.targetClientId+' recives icecandinate')
				const peerConnection = this.peerConnection[data.targetClientId]
				if (peerConnection) {
					peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
					  .catch(error => {
							console.error('Error adding received ICE candidate:', error)
					  })
				  }
			})

			c.on('RTC_CLIENT_DISCONNECTED', data => {
				console.warn(data.targetClientId+' disconnected')
				const videoElement = document.getElementById(data.targetClientId)
				if (videoElement) {
				  videoElement.remove()
				}
				const peerConnection = this.peerConnection[data.targetClientId]
				if (peerConnection) {
				  peerConnection.close()
				  delete this.peerConnection[data.targetClientId]
				}
			})
		})
	}

	createPeerConnection(peerId) {
		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		})

		peerConnection.ontrack = e => {
			console.warn(this.targetClientId +' '+ this.originClientId)

			Html.append(this.div, [
				HtmlVideo.guest(e.streams[0]),
			])
		}

		peerConnection.onicecandidate = e => {
			if (e.candidate) {
				this.socketClient.send({
					action: 'RTC_ICE_CANDIDATE',
					candidate: e.candidate,
					targetClientId: peerId
				})
			}
		}

		return peerConnection
	}

	startCall() {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => {
				Html.left([
					HtmlVideo.local(stream),
				])
				this.localStream = stream
			})
			.catch((error) => {
				console.error('Error starting call', error)
			})
	}
}

