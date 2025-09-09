import { a } from '/static/engine/assertions/a.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { HtmlVideo } from '/static/engine/html/HtmlVideo.js'; 
import { SocketClient } from '/static/engine/multiplayer/socket/SocketClient.js'; 
import { Call } from '/static/engine/tools/Call.js'; 

export class VideoCall {
	constructor() {


		this.localStream
		this.clientId
		this.fromClientId
		this.peerConnection = {}
		this.startCall()
		this.connectedClientId = []

		this.div = Html.right([
		])

		this.socketClient = new SocketClient(8082, c => {

			c.on('RTC_CLIENT_INFO', data => {
				this.clientId = data.clientId
			})

			c.on('RTC_CLIENT_CONNECTED', data => {
				for (let i = 0; i < this.connectedClientId.length; i++) {
					const id = this.connectedClientId[i]
					if (id == data.clientId) {
						console.warn('found')
						return
					}
				}

				if (this.clientId == data.clientId) {
					return
				}

				this.connectedClientId.push(data.clientId)
				const checkForConnection = setInterval(() => {
					if (this.localStream != undefined) {
						clearInterval(checkForConnection)
					}

					const peerConnection = this.createPeerConnection(data.clientId)
					this.peerConnection[data.clientId] = peerConnection

					this.localStream.getTracks().forEach(track => {
						peerConnection.addTrack(track, this.localStream)
					})

					peerConnection.createOffer()
						.then(offer => peerConnection.setLocalDescription(offer))
						.then(() => {
							console.warn(data.clientId + ' offer send')
							this.socketClient.send({
								action: 'RTC_OFFER',
								offer: peerConnection.localDescription,
								clientId: data.clientId
							})
						})
				}, 100)
			})

			c.on('RTC_OFFER', data => {
				console.warn(data.clientId + ' offer recived')
				this.fromClientId = data.fromClientId

				console.warn('from '+this.fromClientId)
				const peerConnection = this.createPeerConnection(data.clientId)
				if (!peerConnection) {
					startCall()
					console.warn('Star')
				}

				this.peerConnection[data.clientId] = peerConnection
				peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
					.then(() => peerConnection.createAnswer())
					.then(answer => peerConnection.setLocalDescription(answer))
					.then(() => {
						console.warn(data.clientId+' answer send')

						this.socketClient.send({
							action: 'RTC_ANSWER',
							answer: peerConnection.localDescription,
							clientId: data.clientId,
							fromClientId: this.fromClientId
						})
					})
					.catch(error => {
						console.error('Error handling offer', error)
					})
			})

			c.on('RTC_ANSWER', data => {
				console.warn(data.clientId+' answer recived from '+data.fromClientId)
				console.warn(data.answer)
				this.socketClient.send({
					action: 'RTC_CLIENT_CONNECTED',
					clientId: data.clientId,
					connectedClientId: this.connectedClientId
				})
				const peerConnection = this.peerConnection[data.clientId]
				peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
					.catch((error) => {
						console.error('Error setting remote description from answer', error)
					})
			})

			c.on('RTC_ICE_CANDIDATE', data => {
				console.warn(data.clientId+' recives icecandinate')
				const peerConnection = this.peerConnection[data.clientId]
				if (peerConnection) {
					peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
					  .catch(error => {
							console.error('Error adding received ICE candidate:', error)
					  })
				  }
			})

			c.on('RTC_CLIENT_DISCONNECTED', data => {
				console.warn(data.clientId+' disconnected')
				const videoElement = document.getElementById(data.clientId)
				if (videoElement) {
				  videoElement.remove()
				}
				const peerConnection = this.peerConnection[data.clientId]
				if (peerConnection) {
				  peerConnection.close()
				  delete this.peerConnection[data.clientId]
				}
			})
		})
	}

	createPeerConnection(peerId) {
		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		})

		peerConnection.ontrack = e => {
			console.warn(this.clientId +' '+ this.fromClientId)

			Html.append(this.div, [
				HtmlVideo.guest(e.streams[0]),
			])
		}

		peerConnection.onicecandidate = e => {
			if (e.candidate) {
				this.socketClient.send({
					action: 'RTC_ICE_CANDIDATE',
					candidate: e.candidate,
					clientId: peerId
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
