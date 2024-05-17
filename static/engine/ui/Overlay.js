export class Overlay {
	constructor(camera) {
		this.remoteVideo = document.createElement("VIDEO")
		this.localVideo = document.createElement("VIDEO")
		this.localVideo.autoplay = true;
		this.localVideo.muted = true;
		this.remoteVideo.autoplay = true;
		document.getElementById("videocallrtc").appendChild(this.localVideo)
		document.getElementById("videocallrtc").appendChild(this.remoteVideo)
		this.localStream;
		this.pc;
				
		this.configuration = {
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		};
		this.socketClient = new SocketClient(8080,c =>{
			c.on("RTC_CLIENT_CONNECTED",data =>{
				console.log(data.clientId);
				this.startCall()
			})
			c.on("RTC_CLIENT_DISCONNECTED",data =>{
				console.log(data.clientId);
				this.hangUp()
			})
			c.on('RTC_OFFER',  (data) => {
				if (!this.pc) {
					this.startCall();
				}
				this.pc.setRemoteDescription(new RTCSessionDescription(data.offer))
					.then(() => {
						return this.pc.createAnswer();
					})
					.then((answer) => {
						return this.pc.setLocalDescription(answer).then(() => answer);
					})
					.then((answer) => {
						this.socketClient.send({
							action:'RTC_ANSWER', 
							answer:answer
						});
					})
					.catch((error) => {
						console.error('Error handling offer', error);
					});
			});
			c.on('RTC_ICE_CANDIDATE',  (data) => {
				this.pc.addIceCandidate(data.candidate)
				.catch((error) => {
					console.error('Error adding received ice candidate', error);
				});
			});
			c.on('RTC_ANSWER',  (data) => {
				this.pc.setRemoteDescription(new RTCSessionDescription(data.answer))
				.catch((error) => {
					console.error('Error setting remote description from answer', error);
				});
			});
		})
		
	}
	update() {
		// this.button.update()
	}
	hangUp(){
		this.pc.close();
			this.pc = null;
			this.socketClient.send({
				action:'RTC_HANGUP'
			})
	}
	startCall(){
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            this.localStream = stream;
            this.localVideo.srcObject = this.localStream;

            this.pc = new RTCPeerConnection(this.configuration);

            this.pc.onicecandidate = (event) => {
				if (event.candidate) {
					this.socketClient.send({
						action:'RTC_ICE_CANDIDATE',
						candidate:event.candidate
					});
				}
			};

            this.pc.ontrack = (event) => {
                this.remoteVideo.srcObject = event.streams[0];
            };

            this.localStream.getTracks().forEach((track) => {
                this.pc.addTrack(track, this.localStream);
            });

            return this.pc.createOffer();
        })
        .then((offer) => {
            return this.pc.setLocalDescription(offer).then(() => offer);
        })
        .then((offer) => {
			console.log("offer "+offer);
			this.socketClient.send({
				action:'RTC_OFFER',
				offer:offer
			})
        })
        .catch((error) => {
            console.error('Error starting call', error);
        });
	}
	addTop(message) {
		const div = document.createElement('div')

		div.classList.add('item')
		div.innerHTML = message

		document.getElementsByClassName('header')[0].appendChild(div)
	}
}
