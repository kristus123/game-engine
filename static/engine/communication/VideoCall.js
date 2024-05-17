export class VideoCall  {
	constructor() {

		this.peerConnection

		this.socketClient = new SocketClient(8080, c => {

			c.on('RTC_CLIENT_CONNECTED', data => {
				this.startCall()
			})

			c.on('RTC_CLIENT_DISCONNECTED', data => {
				this.peerConnection.close()
				this.socketClient.send({
					action: 'RTC_HANGUP'
				})

				this.startCall()
			})

			c.on('RTC_OFFER', data => {
				if (!this.peerConnection) {
					this.startCall()
				}

				this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
					.then(() => this.peerConnection.createAnswer())
					.then(answer => this.peerConnection.setLocalDescription(answer).then(() => answer))
					.then(answer => {
						this.socketClient.send({
							action: 'RTC_ANSWER',
							answer: answer
						})
					})
					.catch(error => {
						console.error('Error handling offer', error)
					})
			})

			c.on('RTC_ICE_CANDIDATE', data => {
				this.peerConnection.addIceCandidate(data.candidate)
					.catch((error) => {
						console.error('Error adding received ice candidate', error)
					})
			})

			c.on('RTC_ANSWER', data => {
				this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
					.catch((error) => {
						console.error('Error setting remote description from answer', error)
					})
			})
		})
	}

	startCall() {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => {

				const localVideo = document.createElement('VIDEO')
				localVideo.autoplay = true
				localVideo.muted = true
				localVideo.srcObject = stream
				document.getElementById('videocallrtc').appendChild(localVideo)

				this.peerConnection = new RTCPeerConnection({
					iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
				})

				this.peerConnection.onicecandidate = e => {
					if (e.candidate) {
						this.socketClient.send({
							action: 'RTC_ICE_CANDIDATE',
							candidate: e.candidate,
						})
					}
				}

				this.peerConnection.ontrack = e => {
					const remoteVideo = document.createElement('VIDEO')
					remoteVideo.autoplay = true
					remoteVideo.srcObject = e.streams[0]
					document.getElementById('videocallrtc').appendChild(remoteVideo)
				}

				stream.getTracks().forEach(track => {
					this.peerConnection.addTrack(track, stream)
				})

				return this.peerConnection.createOffer()
			})
			.then(offer => {
				return this.peerConnection.setLocalDescription(offer).then(() => offer)
			})
			.then(offer => {
				console.log('offer ' + offer)
				this.socketClient.send({
					action: 'RTC_OFFER',
					offer: offer
				})
			})
			.catch((error) => {
				console.error('Error starting call', error)
			})
	}
}
