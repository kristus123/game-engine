export class VideoCall  {
	constructor() {
		this.localStream ;
		this.clientId
		this.clientId
		this.peerConnection = {}
		this.startCall()
		this.socketClient = new SocketClient(8082, c => {

			c.on("RTC_CLIENT_INFO", data =>{
				this.clientId = data.clientId;
			})

			c.on("RTC_CLIENT_CONNECTED",data =>{
				//CREATE PEER CONNECTION FOR NEW USER


				const checkForConnection = setInterval(()=>{
					if(this.localStream != undefined){
						clearInterval(checkForConnection)
					}
					console.warn(data.clientId+" connected");
					const peerConnection = this.createPeerConnection(data.clientId);
					this.peerConnection[data.clientId] = peerConnection;
					
					this.localStream.getTracks().forEach(track => {
						peerConnection.addTrack(track, this.localStream);
					});

					peerConnection.createOffer()
					.then(offer => peerConnection.setLocalDescription(offer))
					.then(() => {
						console.warn(data.clientId+" offer send");
						this.socketClient.send({
							action: 'RTC_OFFER',
							offer: peerConnection.localDescription,
							clientId:data.clientId
						});

					});
			},1000)
			})
			// When an offer is received
			c.on('RTC_OFFER', data => {
				console.warn(data.clientId+" offer recived");
				const peerConnection = this.createPeerConnection(data.clientId);
				if (!peerConnection) {
					startCall();
					console.warn("Star");
					console.warn("Star");
				}
				
				this.peerConnection[data.clientId] = peerConnection;
				peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
					.then(() => peerConnection.createAnswer())
					.then(answer => peerConnection.setLocalDescription(answer))
					.then(() => {
						console.warn(data.clientId+" answer send");
						console.warn(peerConnection.localDescription);
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
				console.warn(data.clientId+" answer recived");
				console.warn(data.answer);
				const peerConnection = this.peerConnection[data.clientId]
				peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
				.catch((error) => {
					console.error('Error setting remote description from answer', error)
				})
			})
			// When an ICE candidate is received
			c.on('RTC_ICE_CANDIDATE', data => {
				console.warn(data.clientId+" recives icecandinate");
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
				console.warn(data.clientId+" disconnected");
				const videoElement = document.getElementById(data.clientId);
				if (videoElement) {
				  videoElement.remove();
				}
				const peerConnection = this.peerConnection[data.fromClientId];
				if (peerConnection) {
				  peerConnection.close();
				  delete this.peerConnection[data.fromClientId];
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
			if (event.candidate) {
				console.warn(peerId+" send icecandinate");
				console.warn(peerId+" send icecandinate");
				this.socketClient.send({
					action: 'RTC_ICE_CANDIDATE',
					candidate: event.candidate,
					fromClientId:peerId
				})
			}
		}
		console.warn(peerConnection.signalingState);
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
