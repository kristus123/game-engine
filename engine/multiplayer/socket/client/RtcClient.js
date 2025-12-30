// ClientId(

export class RtcClient {

	static {
		this.peers = {}
		this.offers = {}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

||||||| parent of 220eda73 (fix)
=======
||||||| parent of 765fa0e0 (x)
=======
<<<<<<< HEAD
>>>>>>> 765fa0e0 (x)
||||||| parent of 2128fa3f (fix)
=======
<<<<<<< HEAD
>>>>>>> 2128fa3f (fix)
||||||| parent of 10f8474a (x)
=======
<<<<<<< HEAD
>>>>>>> 10f8474a (x)
		this.lastCallerId = null
<<<<<<< HEAD
>>>>>>> 220eda73 (fix)
||||||| parent of 765fa0e0 (x)
=======
||||||| parent of 6e2073ba (x)
=======

>>>>>>> 6e2073ba (x)
<<<<<<< HEAD
>>>>>>> 765fa0e0 (x)
||||||| parent of 2128fa3f (fix)
=======
||||||| parent of e5597f20 (fix)

=======
		this.lastCallerId = null
>>>>>>> e5597f20 (fix)
<<<<<<< HEAD
>>>>>>> 2128fa3f (fix)
||||||| parent of 10f8474a (x)
=======
||||||| parent of 3e9814a3 (x)
		this.lastCallerId = null
=======
		this.clientIdOfThePersonCalling = null
>>>>>>> 3e9814a3 (x)
>>>>>>> 10f8474a (x)
		this.localStream = null
		this.startLocalStream()

		this.onData = () => {}

		SocketClient.onClientMessage('CALL', data => {
			console.log(`Incoming call from ${data.originClientId}`)
			this.clientIdOfThePersonCalling = data.originClientId
			console.log(this.clientIdOfThePersonCalling)
			this.offers[data.originClientId] = data.offer
		})

		SocketClient.onClientMessage('ANSWER', data => {
			const peerConnection = this.peers[data.originClientId]?.peerConnection
			if (peerConnection && typeof peerConnection.setRemoteDescription === 'function') {
				peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
					.catch(err => {
						console.warn('setRemoteDescription failed:', err)
					})
			}
			else {
				console.warn('ANSWER received but no valid RTCPeerConnection found for', data.originClientId)
			}
		})

		SocketClient.onClientMessage('ICE_CANDIDATE', data => {
			const peerConnection = this.peers[data.originClientId]?.peerConnection
			if (peerConnection && typeof peerConnection.addIceCandidate === 'function') {
				peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
					.catch(err => {
						console.warn('addIceCandidate failed:', err)
					})
			}
			else {
				console.warn('ICE_CANDIDATE received but no valid RTCPeerConnection found for', data.originClientId)
			}
		})
	}

	static call(targetClientId) {
		const { peerConnection, dataChannel } = this.createPeerConnectionWith(targetClientId)
		this.peers[targetClientId] = { peerConnection, dataChannel }

		// this.localStream.getTracks().forEach(track => {
		// 	peerConnection.addTrack(track, this.localStream)
		// }) // my pc does not have a webcam

		peerConnection.createOffer()
			.then(offer => peerConnection.setLocalDescription(offer))
			.then(() => {
				SocketClient.sendToClient('CALL', targetClientId, {
					offer: peerConnection.localDescription
				})
			})
	}

	static acceptCall() {
		const { peerConnection, dataChannel } = this.createPeerConnectionWith(this.clientIdOfThePersonCalling)
		this.peers[this.clientIdOfThePersonCalling] = { peerConnection, dataChannel }

		peerConnection.setRemoteDescription(new RTCSessionDescription(this.offers[this.clientIdOfThePersonCalling]))
			// .then(() => this.localStream.getTracks().forEach(track => {
			// 	peerConnection.addTrack(track, this.localStream)
			// }))
			.then(() => peerConnection.createAnswer())
			.then(answer => peerConnection.setLocalDescription(answer))
			.then(() => {
				SocketClient.sendToClient('ANSWER', this.clientIdOfThePersonCalling, {
					answer: peerConnection.localDescription
				})
			})
	}

	static send(targetClientId, data) {
		this.peers[targetClientId].dataChannel.send(JSON.stringify(data))
	}

	static createPeerConnectionWith(targetClientId) {
		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		})

		peerConnection.ontrack = () => {
			// Handle remote stream
		}

		peerConnection.onicecandidate = e => {
			if (e.candidate) {
				SocketClient.sendToClient('ICE_CANDIDATE', targetClientId, {
					candidate: e.candidate,
				})
			}
		}

		const dataChannel = peerConnection.createDataChannel('data')

		dataChannel.onopen = () => console.log('Data channel opened')
		dataChannel.onmessage = (e) => {
			console.log(e)
			this.onData(JSON.parse(e.data))
		}

		peerConnection.ondatachannel = (e) => {
			const channel = e.channel
			channel.onopen = () => console.log('Data channel opened')
			channel.onmessage = (e) => {
				this.onData(JSON.parse(e.data))
			}
		}

		return { peerConnection, dataChannel }
	}

	static startLocalStream() {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => {
				this.localStream = stream
				console.log('localStream has been set!')
			})
	}

	static stopCall() {
		for (const clientId in this.peers) {
			this.peers[clientId].close()
		}
		this.peers = {}
	}
}


window.RtcClient = RtcClient
