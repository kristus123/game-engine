export class Overlay {
	constructor(camera) {
		const localVideo = document.createElement("VIDEO")
		localVideo.autoplay = true;
		localVideo.muted = true;
		localVideo.style.position = "absolute"
		localVideo.style.top= 0;
		localVideo.style.left= 0;
		localVideo.style.width = "100px"
		document.getElementById("videocallrtc").appendChild(localVideo)
		let localStream,pc;
		async function startCall() {
			localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			localVideo.srcObject = localStream;
		}
		
		const configuration = {
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		};
		this.socketClient = new SocketClient(8080,c =>{
			c.on("RTC_CLIENT_CONNECTED",data =>{
				console.log(data.clientId);
				startCall()
			})
		})
	}

	update() {
		// this.button.update()
	}

	addTop(message) {
		const div = document.createElement('div')

		div.classList.add('item')
		div.innerHTML = message

		document.getElementsByClassName('header')[0].appendChild(div)
	}
}
/*
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');

let localStream;
let remoteStream;
let pc;
const socket = io();

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

startButton.onclick = startCall;
hangupButton.onclick = hangUp;

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', event.candidate);
        }
    };

    pc.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', offer);
}

socket.on('offer', async (offer) => {
    if (!pc) {
        startCall();
    }
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', answer);
});

socket.on('answer', async (answer) => {
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('ice-candidate', async (candidate) => {
    try {
        await pc.addIceCandidate(candidate);
    } catch (e) {
        console.error('Error adding received ice candidate', e);
    }
});

function hangUp() {
    pc.close();
    pc = null;
    socket.emit('hangup');
}
*/