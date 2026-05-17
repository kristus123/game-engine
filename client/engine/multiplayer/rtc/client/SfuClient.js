export class SfuClient {
	static {
		this.connectedRouterId = ""
		this.element = null
		this.device = null
		this.sendTransport = null
		this.recvTransport = null
		this.localStream = null
		this.producers = {}
		this.consumers = {}

		SocketClient.onServerMessage("SFU_DISCONNECT_CONSUMER", data => {
			if (this.consumers[data.clientId]) {

				this.consumers[data.clientId].stream.getTracks().forEach(track => {
    				track.stop()
				})

				this.consumers[data.clientId].element.remove()

				delete this.consumers[data.clientId]
			}
		})

		SocketClient.onServerMessage("SFU_ROUTER_CREATED", data => {
			console.log(`Router Created: ${data.routerId}`)

			this.connect(data.routerId)
		})

		SocketClient.onServerMessage("SFU_SETUP_CLIENT", async data => {
			console.log("Setting Up SFU Client")

			this.device = new window.mediasoup.Device()
			await this.device.load({ routerRtpCapabilities: data.rtpCapabilities })

			await this.setupSendTransport(data.sendTransportParams)
			await this.setupRecvTransport(data.recvTransportParams)
		})

		SocketClient.onServerMessage("SFU_NEW_PRODUCER", async data => {
			console.log("Consuming New Producer")

			await this.consume(data.producerId, data.clientId)
		})
	}

	static async setupSendTransport(params) {
		this.sendTransport = this.device.createSendTransport(params)

		this.sendTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
			try {
				console.log("Requesting Connection For Webrtc Send Transport")

				SocketClient.sendToServer("SFU_CONNECT_TRANSPORT", {
    				direction: "send",
    				dtlsParameters: dtlsParameters,
    				routerId: this.connectedRouterId
				})
				callback()
			}
			catch (e) {
				errback(e)
			}
		})

		this.sendTransport.on("produce", async ({ kind, rtpParameters }, callback, errback) => {
			try {
				await new Promise(resolve => {
    				SocketClient.serverActionListener.listenOnce("SFU_CONFIRM_PRODUCE", data => {
        				if (data.kind == kind) {
            				callback({ producerId: data.producerId })
            				resolve()
        				}
    				})

    				console.log("Requesting Producer")
    				SocketClient.sendToServer("SFU_REQUEST_PRODUCE", {
        				kind: kind,
        				rtpParameters: rtpParameters,
        				routerId: this.connectedRouterId
    				})
				})
			}
			catch (e) {
				errback(e)
			}
		})

		for (const track of this.localStream.getTracks()) {
			const producer = await this.sendTransport.produce({ track })
			this.producers[track.kind] = producer
		}

		SocketClient.sendToServer("SFU_GET_EXISTING_PRODUCERS", {
			routerId: this.connectedRouterId
		})
	}

	static async setupRecvTransport(params) {
		this.recvTransport = this.device.createRecvTransport(params)

		this.recvTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
			try {
				console.log("Requesting Connection For Webrtc Recv Transport")

				SocketClient.sendToServer("SFU_CONNECT_TRANSPORT", {
    				direction: "recv",
    				dtlsParameters: dtlsParameters,
    				routerId: this.connectedRouterId
				})
				callback()
			}
			catch (e) {
				errback(e)
			}
		})
	}

	static async consume(producerId, originClientId) {
		if (!this.recvTransport) {
			throw new Error("Cannot Consume Receive Transport Not Ready")
			return
		}

		console.log("Requesting Consumer")

		SocketClient.sendToServer("SFU_REQUEST_CONSUME", {
			producerId: producerId,
			rtpCapabilities: this.device.rtpCapabilities,
			routerId: this.connectedRouterId
		})

		SocketClient.serverActionListener.listenOnce("SFU_CONFIRM_CONSUME", async data => {
			if (data.consumerParams.producerId == producerId) {
				const consumer = await this.recvTransport.consume(data.consumerParams)

				if (!this.consumers[originClientId]) {
    				this.consumers[originClientId] = { stream: new MediaStream() }
    				this.consumers[originClientId]["element"] = HtmlVideo.guest(this.consumers[originClientId].stream)
    				Dom.add([ this.consumers[originClientId].element ])
				}

				this.consumers[originClientId].stream.addTrack(consumer.track)
			}
		})
	}

	static async init() {
		this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
		this.element = HtmlVideo.local(this.localStream)
		Dom.add([ this.element ])
	}

	static async create() {
		SocketClient.sendToServer("SFU_CREATE_ROUTER", {})
	}

	static async connect(routerId) {
		await this.init()
		this.connectedRouterId = routerId

		SocketClient.sendToServer("SFU_CONNECT_ROUTER", {
			routerId: routerId
		})
	}

	static disconnect() {
		this.element.remove()
		this.localStream.getTracks().forEach(track => {
			track.stop()
		})

		this.producers.values.forEach(producer => {
			producer.close()
		})

		this.consumers.values.forEach(state => {
			state.stream.getTracks().forEach(track => {
				track.stop()
			})

			state.element.remove()
		})

		this.sendTransport.close()
		this.recvTransport.close()

		this.producers = {}
		this.consumers = {}

		this.sendTransport = null
		this.recvTransport = null
		this.device = null
		this.localStream = null

		SocketClient.sendToServer("SFU_DISCONNECT_ROUTER", {
			routerId: this.connectedRouterId
		})
	}
}