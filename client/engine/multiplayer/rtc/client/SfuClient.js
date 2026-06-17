export class SfuClient {

	static init() { // for some reason enhanceAll.js is not run if just using static block. not important to fix for now
		console.log("good moring")
		this.connectedRouterId = null

		this.device = null
		this.sendTransport = null
		this.recvTransport = null
		this.producers = {}
		this.consumers = {}
<<<<<<< HEAD

		// Move this into SfuRoutes.js, and have it also 
		// SfuRoutes.onRouteCreated = (route) => {}
		// SfuRoutes.onRouteDeleted = (route) => {}
		// you can think of what would be the best solution
		this.routerList = {} // set this to null instead of empty object. also rename it. misleading name

		this.onNewLobbyCreated = (router) => {}
		this.onGuestConnection = (stream) => {}
		this.onNewLobbyDeleted = (routerId) => {}
		this.onjoinLobby = (router) => {}
		this.onleaveLobby = (router) => {}

		SocketClient.sendToServer("SFU_GET_ROUTER_LIST", {})
		SocketClient.onServerMessage("SFU_UPDATE_ROUTER_LIST", data => {
			this.routerList = data.routerList
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
				connectedClientIds: data.connectedClientIds,
			}

			console.log(this.routerList)

			if (data.hostClientId == My.clientId) {
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

		SocketClient.onServerMessage("SFU_SETUP_CLIENT", async data => { // this looks like server inits stuff on connection. if so, it should be moved to the top
			console.log("Setting Up SFU Client")

			this.device = new window.mediasoup.Device()
			await this.device.load({ routerRtpCapabilities: data.rtpCapabilities })

			await this.setupSendTransport(data.sendTransportParams)
			await this.setupRecvTransport(data.recvTransportParams)
		})

		SocketClient.onServerMessage("SFU_NEW_PRODUCER", async data => {
			console.log("Consuming New Producer")
			await this.consume(data.producerId, data.clientId) // It doesn't need to be async.
		})
||||||| parent of f48fce0a (SfuRouters.js and Comment Fixed)

		// Move this into SfuRoutes.js, and have it also 
		// SfuRoutes.onRouteCreated = (route) => {}
		// SfuRoutes.onRouteDeleted = (route) => {}
		// you can think of what would be the best solution
		this.routerList = {} // set this to null instead of empty object. also rename it. misleading name

		this.onNewLobbyCreated = (router) => {}
		this.onGuestConnection = (stream) => {}
		this.onNewLobbyDeleted = (routerId) => {}
		this.onjoinLobby = (router) => {}
		this.onleaveLobby = (router) => {}

		SocketClient.sendToServer("SFU_GET_ROUTER_LIST", {})
		SocketClient.onServerMessage("SFU_UPDATE_ROUTER_LIST", data => {
			this.routerList = data.routerList
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
				connectedClientIds: data.connectedClientIds,
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

		SocketClient.onServerMessage("SFU_SETUP_CLIENT", async data => { // this looks like server inits stuff on connection. if so, it should be moved to the top
			console.log("Setting Up SFU Client")

			this.device = new window.mediasoup.Device()
			await this.device.load({ routerRtpCapabilities: data.rtpCapabilities })

			await this.setupSendTransport(data.sendTransportParams)
			await this.setupRecvTransport(data.recvTransportParams)
		})

		SocketClient.onServerMessage("SFU_NEW_PRODUCER", async data => {
			console.log("Consuming New Producer")
			await this.consume(data.producerId, data.clientId) // It doesn't need to be async.
		})
=======
>>>>>>> f48fce0a (SfuRouters.js and Comment Fixed)
	}

	static async setupSendTransport(params) {
		this.sendTransport = this.device.createSendTransport(params)

		this.sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => { // It seems this class as well does not need to be async.
			try {
				console.log("Requesting Connection For Webrtc Send Transport")

				SocketClient.sendToServer("SFU_CONNECT_TRANSPORT", {
					direction: "send",
					dtlsParameters: dtlsParameters,
					routerId: this.connectedRouterId,
				})

				callback()
			}
			catch (e) {
				errback(e)
			}
		})

		this.sendTransport.on("produce", ({ kind, rtpParameters }, callback, errback) => {
			// Is this the best way to handle it? Will the catch block actually be triggered? And also why are we using new promise? Isn't it possible to write it in a pretty way since we are already using async away?
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
		})

		if (!Webcam.enabled) {
			throw new Error("webcam is not active. enable webcam first!")
		}
		else {
			for (const track of Webcam.stream.getTracks()) {
				const producer = await this.sendTransport.produce({ track })
				this.producers[track.kind] = producer
			}

			SocketClient.sendToServer("SFU_GET_EXISTING_PRODUCERS", {
				routerId: this.connectedRouterId,
			})
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

				this.onGuestConnection(this.consumers[originClientId].stream)
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

	static createLobby() {
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

		// Is there a reason why we are not setting it to null is this to avoid a null pointer exception.
		// If so we should handle the null pointer exception and use a null value instead.
		this.connectedRouterId = null

		SocketClient.sendToServer("SFU_DISCONNECT_ROUTER", {
			routerId: this.connectedRouterId,
		})
	}

	static deleteLobby() {
<<<<<<< HEAD
		if (this.routerList[this.connectedRouterId] && My.clientId == this.routerList[this.connectedRouterId].hostClientId) {
			delete this.routerList[this.connectedRouterId]
||||||| parent of f48fce0a (SfuRouters.js and Comment Fixed)
		if (this.routerList[this.connectedRouterId] && ClientId == this.routerList[this.connectedRouterId].hostClientId) {
			delete this.routerList[this.connectedRouterId]
=======
		if (SfuRouters.routers[this.connectedRouterId] && ClientId == SfuRouters.routers[this.connectedRouterId].hostClientId) {
			delete SfuRouters.routers[this.connectedRouterId]
>>>>>>> f48fce0a (SfuRouters.js and Comment Fixed)

			this.clean()

			SocketClient.sendToServer("SFU_DELETE_ROUTER", {
				routerId: this.connectedRouterId,
			})
		}
	}

	static get isHost() {
<<<<<<< HEAD
		return (this.routerList[this.connectedRouterId].hostClientId == My.clientId)
||||||| parent of f48fce0a (SfuRouters.js and Comment Fixed)
		return (this.routerList[this.connectedRouterId].hostClientId == ClientId)
=======
		return (SfuRouters.routers[this.connectedRouterId].hostClientId == ClientId)
>>>>>>> f48fce0a (SfuRouters.js and Comment Fixed)
	}

	static get connectedClientIds() {
		return SfuRouters.routers[this.connectedRouterId].connectedClientIds
	}
}
