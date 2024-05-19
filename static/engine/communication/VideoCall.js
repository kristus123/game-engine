export class VideoCall  {
	constructor() {
		this.localStream ;
		this.clientId;
		this.peerConnection = {}
		this.startCall()
		this.socketClient = new SocketClient(8080, c => {
			/*c.on("RTC_CLIENT_CONNECTED",data =>{
				console.warn(this.localstream);
			})*/
			
			c.on("RTC_CLIENT_CONNECTED",data =>{
				//CREATE PEER CONNECTION FOR NEW USER
				console.warn(data.clientId+" connected");
				this.clientId = data.clientId
				const peerConnection = this.createPeerConnection(data.clientId);
				this.peerConnection[data.clientId] = peerConnection;
				//geting and adding tracks
				this.localStream.getTracks().forEach(track => {
					peerConnection.addTrack(track, this.localStream);
				});
				//creating offer
				peerConnection.createOffer()
				.then(offer => peerConnection.setLocalDescription(offer))
				.then(() => {
					this.socketClient.send({
						action: 'RTC_OFFER',
						offer: peerConnection.localDescription,
						clientId:data.clientId
					});
				});
			})
			// When an offer is received
			c.on('RTC_OFFER', data => {
				console.warn(data.clientId+" recives offer");
				const peerConnection = this.createPeerConnection(data.clientId);
				if (!peerConnection) {
					startCall();
				}
				this.peerConnection[data.clientId] = peerConnection;
				peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
					.then(() => peerConnection.createAnswer())
					.then(answer => peerConnection.setLocalDescription(answer))
					.then(() => {
						this.socketClient.send({
							action: 'RTC_ANSWER',
							answer: peerConnection.localDescription,
							clientId:data.clientId
						})
					})
					.catch(error => {
						console.error('Error handling offer', error)
					})
			})
			// When answer is received
			c.on('RTC_ANSWER', data => {
				console.warn(data.clientId+" recives answer");
				const peerConnection = this.peerConnection[data.clientId]
				peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
				.catch((error) => {
					console.error('Error setting remote description from answer', error)
				})
			})
			// When an ICE candidate is received
			c.on('RTC_ICE_CANDIDATE', data => {
				console.warn(data.clientId);
				const peerConnection = this.peerConnection[data.clientId];
				if (peerConnection) {
					peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
					  .catch(error => {
						console.error('Error adding received ICE candidate:', error);
					  });
				  }
			})
			//When user is disconnected
			c.on('RTC_CLIENT_DISCONNECTED', data => {
				const videoElement = document.getElementById(data.clientId);
				if (videoElement) {
				  videoElement.remove();
				}
				const peerConnection = this.peerConnection[data.clientId];
				if (peerConnection) {
				  peerConnection.close();
				  delete this.peerConnection[userId];
				}
			})
			
		})
	}
	createPeerConnection(peerId){
		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		})
		
		peerConnection.ontrack = (event) => {
			let remoteVideo = document.getElementById(peerId);
			if (!remoteVideo) {
				remoteVideo = document.createElement('video');
				remoteVideo.id = peerId;
				remoteVideo.autoplay = true;
				document.getElementById('videocallrtc').appendChild(remoteVideo);
			}
			remoteVideo.srcObject = event.streams[0];
		};
		peerConnection.onicecandidate = event => {
			console.warn("sendice"+peerId);
			if (event.candidate) {
				this.socketClient.send({
					action: 'RTC_ICE_CANDIDATE',
					candidate: event.candidate,
					clientId:peerId
				})
			}
		}
		
		peerConnection.addEventListener('signalingstatechange', () => {
			console.warn('Signaling state change:', peerConnection.signalingState);
		});
		return peerConnection;
	}
	startCall() {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => {
				//creating and setting local streaming
				const localVideo = document.createElement('VIDEO')
				localVideo.autoplay = true
				localVideo.muted = true
				localVideo.srcObject = stream
				document.getElementById('videocallrtc').appendChild(localVideo)
				//setting stream to local stream
				this.localStream = stream;
 				
			})
			.catch((error) => {
				console.error('Error starting call', error)
			})
	}
}
