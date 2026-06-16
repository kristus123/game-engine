export class SfuClient {
	static {
		this.streamMode = false

		this.connectedRouterId = ""

		this.element = null
		this.device = null
		this.sendTransport = null
		this.recvTransport = null
		this.localStream = null

		this.producers = {}
		this.consumers = {}
		this.routerList = {}

		this.onNewLobbyCreated = (router) => {}
		this.onNewLobbyDeleted = (routerId) => {}
		this.onjoinLobby = (router) => {}
		this.onleaveLobby = (router) => {}

		SocketClient.onServerMessage("SFU_UPDATE_ROUTER_LIST", data => {
			this.routerList = data.routerList

			console.log(this.routerList)
		})

		SocketClient.onServerMessage("SFU_ROUTER_DELETED", data => {
			delete this.routerList[data.routerId]

			this.onNewLobbyDeleted(data.routerId)
		})

		SocketClient.onServerMessage("SFU_DISCONNECT_CONSUMER", data => {
			const router = this.routerList[data.routerId]

			if (router) {
				router.connectedClientIds.removeIfPresent(data.clientId)
			}

			console.log(this.routerList)

			if (this.consumers[data.clientId]) {

				this.consumers[data.clientId].stream.getTracks().forEach(track => {
					track.stop()
				})

				this.consumers[data.clientId].element.remove()

				delete this.consumers[data.clientId]
			}

			this.onleaveLobby(router)
		})

		SocketClient.onServerMessage("SFU_ROUTER_CREATED", data => {
			console.log(`New Router Created: ${data.routerId}`)

			this.routerList[data.routerId] = {
				routerId: data.routerId,
				hostClientId: data.hostClientId,
				connectedClientIds: data.connectedClientIds
			}

			console.log(this.routerList)

			if (data.hostClientId == ClientId) {
				this.joinLobby(data.routerId)
			}

			this.onNewLobbyCreated(this.routerList[data.routerId])
		})

		SocketClient.onServerMessage("SFU_NEW_CONNECTION", data => {
			const router = this.routerList[data.routerId]

			if (router) {
				router.connectedClientIds.addIfMissing(data.newlyConnectedClientId)
			}

			console.log(this.routerList)

			this.onjoinLobby(router)
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

					if (this.streamMode && !this.isHost) {
						Dom.add(this.consumers[originClientId].element)
					}
					else if (!this.streamMode) {
						Dom.add(this.consumers[originClientId].element)
					}
				}

				this.consumers[originClientId].stream.addTrack(consumer.track)
			}
		})
	}

	static appendLocalVideoElement() {
		this.element = HtmlVideo.local(this.localStream)
		Dom.add(this.element)
	}

	static async init() {
		this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

		// check if we wanted to Call instead of Stream (For Joiners)
		if (!this.streamMode) {
			this.appendLocalVideoElement()
		}

		SocketClient.sendToServer("SFU_GET_ROUTER_LIST", {})
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

	static createLobby() {
		// we want to add element of us even if we Stream
		if (this.streamMode) {
			this.appendLocalVideoElement()
		}

		SocketClient.sendToServer("SFU_CREATE_ROUTER", {})
	}

	static async joinLobby(routerId) {
		this.connectedRouterId = routerId

		SocketClient.sendToServer("SFU_CONNECT_ROUTER", {
			routerId: routerId
		})
	}

	static leaveLobby() {
		this.clean()

		this.connectedRouterId = ""

		SocketClient.sendToServer("SFU_DISCONNECT_ROUTER", {
			routerId: this.connectedRouterId
		})
	}

	static deleteLobby() {
		if (this.routerList[this.connectedRouterId] && ClientId == this.routerList[this.connectedRouterId].hostClientId) {
			delete this.routerList[this.connectedRouterId]

			this.clean()

			SocketClient.sendToServer("SFU_DELETE_ROUTER", {
				routerId: this.connectedRouterId
			})
		}
	}

	static get isHost() {
		return (this.routerList[this.connectedRouterId].hostClientId == ClientId)
	}

	static get connectedClientIds() {
		return this.routerList[this.connectedRouterId].connectedClientIds
	}
}