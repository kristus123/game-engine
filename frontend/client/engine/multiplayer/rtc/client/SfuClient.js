export class SfuClient {
	static init() {
		this.connectedRouterId = null

		this.device = null
		this.sendTransport = null
		this.recvTransport = null
		this.producers = {}
		this.dataProducer = null
		this.consumers = {}
		this.dataConsumers = {}

		this.isAudioMuted = true

		this.videoStream = VideoStream()
		this.audioStream = AudioStream()
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

		this.sendTransport.on("producedata", async ({ sctpStreamParameters, label, protocol, appData }, callback, errback) => {
			await new Promise(resolve => {
				SocketClient.serverActionListener.listenOnce("SFU_CONFIRM_PRODUCE_DATA", data => {
					callback({ id: data.producerId })
					resolve()
				})

				console.log("Requesting Data Producer")

				SocketClient.sendToServer("SFU_REQUEST_PRODUCE_DATA", {
					sctpStreamParameters: sctpStreamParameters,
					label: label,
					protocol: protocol,
					appData: appData,
					routerId: this.connectedRouterId
				})
			})
		})

		if (!Webcam.enabled) {
			throw new Error("webcam is not active. enable webcam first!")
		}
		else {
			for (const track of this.videoStream.stream.getVideoTracks()) {
				const producer = await this.sendTransport.produce({ track })

				this.producers[producer.id] = producer
			}

			for (const track of this.audioStream.stream.getAudioTracks()) {
				const producer = await this.sendTransport.produce({ track })

				this.producers[producer.id] = producer
			}
		}

		this.dataProducer = await this.sendTransport.produceData({
			ordered: true,
			label: "text",
			protocol: ""
		})
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

		SocketClient.serverActionListener.listen("SFU_CONFIRM_CONSUME", async data => {
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

	static async consumeData(producerId, originClientId) {
		if (!this.recvTransport) {
			throw new Error("Cannot Consume Data Receive Transport Not Ready")
		}

		console.log("Requesting Data Consumer")

		SocketClient.sendToServer("SFU_REQUEST_CONSUME_DATA", {
			producerId: producerId,
			sctpCapabilities: this.device.sctpCapabilities,
			routerId: this.connectedRouterId
		})

		SocketClient.serverActionListener.listen("SFU_CONFIRM_CONSUME_DATA", async data => {
			if (data.consumerParams.dataProducerId == producerId) {
				const consumer = await this.recvTransport.consumeData(data.consumerParams)

				this.dataConsumers[originClientId] = consumer

				consumer.on("message", message => {
					SfuRouters.onMessage(originClientId, message)
				})
			}
		})
	}


	static clean() {
		this.consumers.values.forEach(state => {
			state.stream.getTracks().forEach(track => {
				track.stop()
			})
		})

		this.dataConsumers.values.forEach(state => {
			state.close()
		})

		this.consumers = {}
		this.dataConsumers = {}
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
		if (clientId == My.clientId || SfuClient.isHost) {
			SocketClient.sendToClient("SFU_CLIENT_MUTE_SELF", clientId, {
				routerId: this.connectedRouterId,
			})
		}
		else {
			throw new Error("You do not have permission to mute", clientId)
		}
	}

	static unmute(clientId) {
		if (clientId == My.clientId || SfuClient.isHost) {
			SocketClient.sendToClient("SFU_CLIENT_UNMUTE_SELF", clientId, {
				routerId: this.connectedRouterId,
			})
		}
		else {
			throw new Error("You do not have permission to unmute", clientId)
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
		console.log("stopping video")

		this.videoStream.pause()
	}

	static async startVideo() {
		console.log("starting video")

		await this.videoStream.resume()
	}

	static toggleMic() {
		if (this.isAudioMuted) {
			this.muteSelf()
		}
		else {
			this.unmuteSelf()
		}

		this.isAudioMuted = !this.isAudioMuted
	}

	static async toggleVideo() {
		if (this.videoStream.enabled) {
			this.stopVideo()
		}
		else {
			await this.startVideo()
		}
	}

	static sendToEveryone(json) {
		Assert.jsonObject(json)

		this.dataProducer.send(JSON.stringify(json))
	}

	static kick(clientId) {
		if (clientId == My.clientId) {
			throw new Error("You can't kick yourself!")
		} else if (!SfuClient.isHost) {
			throw new Error("You do not have permission to kick", clientId)
		} else {
			SocketClient.sendToClient("SFU_KICK_SELF", clientId, {
				routerId: SfuClient.connectedRouterId
			})
		}
	}
}