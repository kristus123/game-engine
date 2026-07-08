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

		this.videoStream = VideoStream()
		this.audioStream = null
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
			if (this.videoStream){
				for (const track of this.videoStream.stream.getTracks()) {
					const producer = await this.sendTransport.produce({ track })

					this.producers[producer.id] = producer
				}
			}

			if (this.audioStream) {
				for (const track of this.audioStream.getTracks()) {
					const producer = await this.sendTransport.produce({ track })

					this.producers[producer.id] = producer
				}
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

	static mute(clientId) {
		if (clientId == My.clientId) {
			this.muteSelf()
		} else {
			SocketClient.sendToServer("SFU_MUTE_CLIENT", {
				routerId: this.connectedRouterId,
				targetClientId: clientId
			})
		}
	}

	static unmute(clientId) {
		if (clientId == My.clientId) {
			this.unmuteSelf()
		} else {
			SocketClient.sendToServer("SFU_UNMUTE_CLIENT", {
				routerId: this.connectedRouterId,
				targetClientId: clientId
			})
		}
	}

	static muteSelf() {
		this.producers.values.forEach(producer => {
			if (producer.kind == "audio") {
				console.log("muting myself")

				producer.pause()
			}
		})
	}

	static unmuteSelf() {
		this.producers.values.forEach(producer => {
			if (producer.kind == "audio") {
				console.log("unmuting myself")

				producer.resume()
			}
		})
	}

	static stopVideo() {
		this.producers.values.forEach(producer => {
			if (producer.kind == "video") {
				console.log("stopping video")

				producer.pause()
			}
		})
	}

	static startVideo() {
		this.producers.values.forEach(producer => {
			console.log(producer)
			if (producer.kind == "video") {
				console.log("starting video")

				producer.resume()
			}
		})
	}

	static toggleAudio() {
		if (this.canSendAudio) {
			this.muteSelf()
		}
		else {
			this.unmuteSelf()
		}

		this.canSendAudio = !this.canSendAudio
	}

	static toggleVideo() {
		if (this.canSendVideo) {
			this.stopVideo()
		}
		else {
			this.startVideo()
		}

		this.canSendVideo = !this.canSendVideo
	}
}
