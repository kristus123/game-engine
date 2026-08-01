export class SfuRouters {
	static init() {
		this.routers = {}

		this.onRouterCreated = (router) => {}
		this.onRouterDeleted = (routerId) => {}
		this.onGuestConnection = (stream) => {}
		this.onLocalConnection = () => {}
		this.onLocalSetup = () => {}
		this.onJoinRouter = (router) => {}
		this.onLeaveRouter = (router) => {}
		this.onMessage = (clientId, data) => {}

		SocketClient.onClientMessage("SFU_MESSAGE", data => {
			this.onMessage(data.originClientId, JSON.parse(data.message))
		})

		SocketClient.onClientMessage("SFU_KICK_SELF", data => {
			if (data.routerId == SfuClient.connectedRouterId) {
				SfuClient.leaveRouter()

				console.log("You Have Been Kicked!")
			}
		})

		SocketClient.onClientMessage("SFU_CLIENT_MUTE_SELF", data => {
			if (data.routerId == SfuClient.connectedRouterId) {
				SfuClient.muteSelf()
			}
		})

		SocketClient.onClientMessage("SFU_CLIENT_UNMUTE_SELF", data => {
			if (data.routerId == SfuClient.connectedRouterId) {
				SfuClient.unmuteSelf()
			}
		})

		SocketClient.onServerMessage("SFU_UPDATE_ROUTER_LIST", data => {
			this.routers = data.routerList

			// nabir rewrite by using enhance_js stuff instead. i think it is this.routers.keys
			console.log(this.routers.keys)
			this.routers.keys.forEach(routerId => {
				this.onRouterCreated(this.routers[routerId])
			})
		})

		SocketClient.onServerMessage("SFU_SETUP_CLIENT", async data => {
			console.log("Setting Up SFU Client")

			const router = this.routers[SfuClient.connectedRouterId]

			SfuClient.device = new window.mediasoup.Device()
			await SfuClient.device.load({ routerRtpCapabilities: data.rtpCapabilities })

			if (!SfuRouters.routers[SfuClient.connectedRouterId].streamOnly || SfuClient.isHost) {
				SfuRouters.onLocalSetup()
			}

			await SfuClient.setupSendTransport(data.sendTransportParams)
			await SfuClient.setupRecvTransport(data.recvTransportParams)

			this.onLocalConnection()

			console.log("Getting Producers...")
			SocketClient.sendToServer("SFU_GET_EXISTING_PRODUCERS", {
				routerId: SfuClient.connectedRouterId,
			})
		})

		SocketClient.onServerMessage("SFU_ROUTER_DELETED", data => {
			delete this.routers[data.routerId]

			this.onRouterDeleted(data.routerId)
		})

		SocketClient.onServerMessage("SFU_DISCONNECT_CONSUMER", data => {
			const router = this.routers[data.routerId]

			if (router) {
				router.connectedClientIds.removeIfPresent(data.clientId)
			}

			console.log(this.routers)

			if (SfuClient.consumers[data.clientId]) {

				SfuClient.consumers[data.clientId].stream.getTracks().forEach(track => {
					track.stop()
				})

				delete SfuClient.consumers[data.clientId]
			}

			this.onLeaveRouter(router)
		})

		SocketClient.onServerMessage("SFU_ROUTER_CREATED", data => {
			console.log(`New Router Created: ${data.routerId}`)

			this.routers[data.routerId] = {
				routerId: data.routerId,
				hostClientId: data.hostClientId,
				connectedClientIds: data.connectedClientIds,
				streamOnly: data.streamOnly
			}

			console.log(this.routers)

			if (data.hostClientId == My.clientId) {
				console.log("Joining Created Lobby...")
				SfuClient.joinRouter(data.routerId)
			}

			this.onRouterCreated(this.routers[data.routerId])
		})

		SocketClient.onServerMessage("SFU_NEW_CONNECTION", data => {
			const router = this.routers[data.routerId]

			if (router) {
				router.connectedClientIds.addIfMissing(data.newlyConnectedClientId)
			}

			console.log(this.routers)

			this.onJoinRouter(router)
		})

		SocketClient.onServerMessage("SFU_NEW_PRODUCER", async data => {
			console.log("Consuming New Producer")

			// Consume Streams *Only* if Viewer *Only* when Stream Mode is On
			if (!this.routers[SfuClient.connectedRouterId].streamOnly || !SfuClient.isHost) {
				SfuClient.consume(data.producerId, data.clientId)
			}
		})

		SocketClient.onServerMessage("SFU_NEW_DATA_PRODUCER", async data => {
			console.log("Consuming New Producer")

			SfuClient.consumeData(data.producerId, data.clientId)
		})

		setTimeout(() => {
			// hack to wait for server to connect. todo fix
			SocketClient.sendToServer("SFU_GET_ROUTER_LIST", {})
		}, 1_000)
	}
}
