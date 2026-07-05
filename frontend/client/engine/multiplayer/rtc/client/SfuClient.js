export class SfuClient {
	static init() {
		this.connectedRouterId = null

		this.device = null
		this.sendTransport = null
		this.recvTransport = null
		this.producers = {}
		this.consumers = {}

		this.canSendVideo = true
		this.canSendAudio = true
	}

	static async setupSendTransport(params) {
		this.sendTransport = this.device.createSendTransport(params)

		this.sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
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
			await new Promise(resolve => {
				SocketClient.serverActionListener.listenOnce("SFU_CONFIRM_PRODUCE", data => {
					if (data.kind == kind) {
						callback({ id: data.producerId })
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
		})

		if (!Webcam.enabled) {
			throw new Error("webcam is not active. enable webcam first!")
		}
		else {
			for (const track of Webcam.cam.getTracks()) {
				const producer = await this.sendTransport.produce({ track })
				this.producers[producer.id] = producer
			}
		}
	}

	static async setupRecvTransport(params) {
		this.recvTransport = this.device.createRecvTransport(params)

		this.recvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
			console.log("Requesting Connection For Webrtc Recv Transport")

			SocketClient.sendToServer("SFU_CONNECT_TRANSPORT", {
				direction: "recv",
				dtlsParameters: dtlsParameters,
				routerId: this.connectedRouterId
			})

			callback()
		})
	}

	static async consume(producerId, originClientId) {
		if (!this.recvTransport) {
			throw new Error("Cannot Consume Receive Transport Not Ready")
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
				}

				this.consumers[originClientId].stream.addTrack(consumer.track)
				SfuRouters.onGuestConnection(this.consumers[originClientId].stream)
			}
		})
	}

	static clean() {
		this.consumers.values.forEach(state => {
			state.stream.getTracks().forEach(track => {
				track.stop()
			})

			state.element.remove()
		})

		this.consumers = {}
	}

	static createRouter(streamOnly = false) {
		SocketClient.sendToServer("SFU_CREATE_ROUTER", {
			streamOnly: streamOnly
		})
	}

	static async joinRouter(routerId) {
		this.connectedRouterId = routerId

		SocketClient.sendToServer("SFU_CONNECT_ROUTER", {
			routerId: routerId
		})
	}

	static leaveRouter() {
		this.clean()

		SocketClient.sendToServer("SFU_DISCONNECT_ROUTER", {
			routerId: this.connectedRouterId,
		})

		this.connectedRouterId = null
	}

	static deleteRouter() {
		if (SfuRouters.routers[this.connectedRouterId] && My.clientId == SfuRouters.routers[this.connectedRouterId].hostClientId) {
			delete SfuRouters.routers[this.connectedRouterId]

			this.clean()

			SocketClient.sendToServer("SFU_DELETE_ROUTER", {
				routerId: this.connectedRouterId,
			})
		}
	}

	static get isHost() {
		return (SfuRouters.routers[this.connectedRouterId].hostClientId == My.clientId)
	}

	static get connectedClientIds() {
		return SfuRouters.routers[this.connectedRouterId].connectedClientIds
	}

	static toggleAudio() {
		this.producers.values.forEach(producer => {
			if (producer.kind == "audio") {
				console.log("changing audio state")

				if (this.canSendAudio) {
					producer.pause()
				}
				else {
					producer.resume()
				}

				this.canSendAudio = !this.canSendAudio
			}
		})
	}

	static toggleVideo() {
		this.producers.values.forEach(producer => {
			if (producer.kind == "video") {
				console.log("changing video state")

				if (this.canSendVideo) {
					producer.pause()
				}
				else {
					producer.resume()
				}

				this.canSendVideo = !this.canSendVideo
			}
		})
	}
}
