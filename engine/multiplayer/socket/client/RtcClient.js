// ClientId(
  import * as mediasoupClient from 'https://unpkg.com/mediasoup-client@3.11.2/lib/index.js';

export class RtcClient {

	static {
		this.peers = {}       // P2P channels
		this.offers = {}      // P2P offers
		this.localStream = null
		this.sfuChannel = null
		this.onData = () => {}
		this.onIncomingCall = (callerClientId) => {}

		this.init()

		// --- P2P signaling ---
		SocketClient.onClientMessage('INCOMING_CALL', data => {
			this.offers[data.originClientId] = data.offer
			this.onIncomingCall(data.originClientId)
		})

		SocketClient.onClientMessage('ACCEPT_INCOMING_CALL', data => {
			const peerConnection = this.peers[data.originClientId]?.peerConnection
			if (peerConnection) peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
				.catch(err => console.warn('setRemoteDescription failed:', err))
		})

		SocketClient.onClientMessage('ICE_CANDIDATE', data => {
			const peerConnection = this.peers[data.originClientId]?.peerConnection
			if (peerConnection) peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
				.catch(err => console.warn('addIceCandidate failed:', err))
		})

		// --- Mediasoup: handle new producers from other clients ---
		SocketClient.onClientMessage('NEW_PRODUCER', async data => {
			if (!this.sfuChannel) return
			const { producerId, producerClientId } = data
			const stream = await this.sfuChannel.consume(producerId)
			// You can attach stream to an <audio> element:
			const audioEl = document.createElement('audio')
			audioEl.srcObject = stream
			audioEl.autoplay = true
			document.body.appendChild(audioEl)
		})
	}

	// ------------------- Init -------------------
	static init() {
		this.startLocalStream()
		 this.createMediasoupChannel()
	}

	// ------------------- P2P -------------------
	static call(targetClientId) {
		const { peerConnection, dataChannel } = this.createPeerConnectionWith(targetClientId)
		this.peers[targetClientId] = { peerConnection, dataChannel }

		// Add local audio only
		if (this.localStream) this.localStream.getAudioTracks().forEach(track => peerConnection.addTrack(track, this.localStream))

		peerConnection.createOffer()
			.then(offer => peerConnection.setLocalDescription(offer))
			.then(() => SocketClient.sendToClient('INCOMING_CALL', targetClientId, { offer: peerConnection.localDescription }))
	}

	static acceptCall(callerClientId) {
		const { peerConnection, dataChannel } = this.createPeerConnectionWith(callerClientId)
		this.peers[callerClientId] = { peerConnection, dataChannel }

		peerConnection.setRemoteDescription(new RTCSessionDescription(this.offers[callerClientId]))
			.then(() => {
				if (this.localStream) this.localStream.getAudioTracks().forEach(track => peerConnection.addTrack(track, this.localStream))
			})
			.then(() => peerConnection.createAnswer())
			.then(answer => peerConnection.setLocalDescription(answer))
			.then(() => SocketClient.sendToClient('ACCEPT_INCOMING_CALL', callerClientId, { answer: peerConnection.localDescription }))
	}

	static send(targetClientId, data) {
		this.peers[targetClientId]?.dataChannel.send(JSON.stringify(data))
	}

	static createPeerConnectionWith(targetClientId) {
		const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })

		peerConnection.ontrack = () => {}

		peerConnection.onicecandidate = e => {
			if (e.candidate) SocketClient.sendToClient('ICE_CANDIDATE', targetClientId, { candidate: e.candidate })
		}

		const dataChannel = peerConnection.createDataChannel('data')
		dataChannel.onopen = () => console.log('P2P Data channel opened')
		dataChannel.onmessage = (e) => this.onData(JSON.parse(e.data))

		peerConnection.ondatachannel = (e) => {
			const channel = e.channel
			channel.onopen = () => console.log('Incoming P2P Data channel opened')
			channel.onmessage = (e) => this.onData(JSON.parse(e.data))
		}

		return { peerConnection, dataChannel }
	}

	// ------------------- Mediasoup SFU -------------------
	static async createMediasoupChannel() {
		const routerRtpCapabilities = await SocketClient.request('getRouterRtpCapabilities')

		const params = await SocketClient.request('createWebRtcTransport', { direction: 'send' })
		const device = new mediasoupClient.Device()
		await device.load({ routerRtpCapabilities })
		const transport = device.createSendTransport(params)

		transport.on('connect', ({ dtlsParameters }, callback, errback) => {
			SocketClient.send('connectTransport', { dtlsParameters })
			callback()
		})

		transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
			const id = await SocketClient.request('produce', { kind, rtpParameters })
			callback({ id })
		})

		this.sfuChannel = {
			device,
			sendTransport: transport,
			producer: null,
			consumers: new Map(),
			consume: async (producerId) => {
				const peer = { recvTransport: transport } // reuse sendTransport temporarily
				if (!peer.recvTransport) {
					const recvParams = await SocketClient.request('createWebRtcTransport', { direction: 'recv' })
					peer.recvTransport = device.createRecvTransport(recvParams)
					peer.recvTransport.on('connect', ({ dtlsParameters }, callback) => {
						SocketClient.send('connectTransport', { dtlsParameters })
						callback()
					})
				}

				const consumerParams = await SocketClient.request('consume', { producerId })
				const consumer = await peer.recvTransport.consume(consumerParams)
				const stream = new MediaStream()
				stream.addTrack(consumer.track)
				this.sfuChannel.consumers.set(producerId, consumer)
				return stream
			}
		}

		// Produce local audio only
		if (this.localStream) {
			const track = this.localStream.getAudioTracks()[0]
			if (track) this.sfuChannel.producer = await transport.produce({ track })
		}
	}

	// ------------------- Utilities -------------------
	static async startLocalStream() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			this.localStream = stream
			console.log('Local audio stream ready!')
		} catch (err) {
			console.warn('Failed to get local audio:', err)
			this.localStream = null
		}
	}

	static stopCall() {
		for (const clientId in this.peers) this.peers[clientId].close?.()
		this.peers = {}
		this.sfuChannel = null
	}
}

window.RtcClient = RtcClient

