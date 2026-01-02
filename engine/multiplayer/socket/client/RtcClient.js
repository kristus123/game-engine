// ClientId(
//
import * as mediasoupClient from 'https://cdn.jsdelivr.net/npm/mediasoup-client@3.11.2/lib/index.min.js';

export class RtcClient {

	static {
		this.peers = {}
		this.offers = {}
		this.localStream = null
		this.sfuChannel = null

		this.onData = () => {}
		this.onIncomingCall = (callerClientId) => {}

		this.init()

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
	}

	static async init() {
		await this.startLocalStream()
		await this.createMediasoupChannel()
	}

	// ------------------- P2P -------------------

	static call(targetClientId) {
		const { peerConnection, dataChannel } = this.createPeerConnectionWith(targetClientId)
		this.peers[targetClientId] = { peerConnection, dataChannel }

		// this.localStream.getTracks().forEach(track => peerConnection.addTrack(track, this.localStream))

		peerConnection.createOffer()
			.then(offer => peerConnection.setLocalDescription(offer))
			.then(() => SocketClient.sendToClient('INCOMING_CALL', targetClientId, {
				offer: peerConnection.localDescription
			}))
	}

	static acceptCall(callerClientId) {
		const { peerConnection, dataChannel } = this.createPeerConnectionWith(callerClientId)
		this.peers[callerClientId] = { peerConnection, dataChannel }

		peerConnection.setRemoteDescription(new RTCSessionDescription(this.offers[callerClientId]))
			// .then(() => this.localStream.getTracks().forEach(track => peerConnection.addTrack(track, this.localStream)))
			.then(() => peerConnection.createAnswer())
			.then(answer => peerConnection.setLocalDescription(answer))
			.then(() => SocketClient.sendToClient('ACCEPT_INCOMING_CALL', callerClientId, {
				answer: peerConnection.localDescription
			}))
	}

	static send(targetClientId, data) {
		this.peers[targetClientId].dataChannel.send(JSON.stringify(data))
	}

	static createPeerConnectionWith(targetClientId) {
		const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })

		peerConnection.ontrack = () => {}

		peerConnection.onicecandidate = e => {
			if (e.candidate) SocketClient.sendToClient('ICE_CANDIDATE', targetClientId, { candidate: e.candidate })
		}

		const dataChannel = peerConnection.createDataChannel('data')
		dataChannel.onopen = () => console.log('Data channel opened')
		dataChannel.onmessage = (e) => this.onData(JSON.parse(e.data))

		peerConnection.ondatachannel = (e) => {
			const channel = e.channel
			channel.onopen = () => console.log('Data channel opened')
			channel.onmessage = (e) => this.onData(JSON.parse(e.data))
		}

		return { peerConnection, dataChannel }
	}

	// ------------------- Mediasoup SFU -------------------

	static async createMediasoupChannel() {
		this.sfuChannel = {
			sendTransport: null,
			producer: null,
			consumers: new Map(),
		}

		const routerRtpCapabilities = await SocketClient.request('getRouterRtpCapabilities')

		const params = await SocketClient.request('createWebRtcTransport', { direction: 'send' })
		const device = new mediasoupClient.Device()
		await device.load({ routerRtpCapabilities })
		const transport = device.createSendTransport(params)
		this.sfuChannel.sendTransport = transport

		transport.on('connect', ({ dtlsParameters }, callback, errback) => {
			SocketClient.send('connectTransport', { dtlsParameters })
			callback()
		})

		transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
			const id = await SocketClient.request('produce', { kind, rtpParameters })
			callback({ id })
		})

		if (this.localStream) {
			const track = this.localStream.getAudioTracks()[0] || this.localStream.getVideoTracks()[0]
			this.sfuChannel.producer = await transport.produce({ track })
		}
	}

	// ------------------- Utilities -------------------

	static async startLocalStream() {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
		this.localStream = stream
		console.log('localStream has been set!')
	}

	static stopCall() {
		for (const clientId in this.peers) this.peers[clientId].close?.()
		this.peers = {}
		this.sfuChannel = null
	}
}

window.RtcClient = RtcClient

