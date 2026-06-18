export class SfuRouters {
    static init() {
		this.routers = {}

		this.onRouterCreated = (router) => {}
		this.onRouterDeleted = (routerId) => {}
		this.onGuestConnection = (stream) => {}
		this.onLocalConnection = (stream) => {}
		this.onJoinLobby = (router) => {}
		this.onLeaveLobby = (router) => {}

		SocketClient.onServerMessage("SFU_UPDATE_ROUTER_LIST", data => {
			this.routers = data.routerList

			Object.keys(this.routers).forEach(routerId => {
				this.onRouterCreated(this.routers[routerId])
			})
		})

		SocketClient.onServerMessage("SFU_SETUP_CLIENT", async data => {
			console.log("Setting Up SFU Client")

			SfuClient.device = new window.mediasoup.Device()
			await SfuClient.device.load({ routerRtpCapabilities: data.rtpCapabilities })

			await SfuClient.setupSendTransport(data.sendTransportParams)
			await SfuClient.setupRecvTransport(data.recvTransportParams)
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

				SfuClient.consumers[data.clientId].element.remove()

				delete SfuClient.consumers[data.clientId]
			}

			this.onLeaveLobby(router)
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

			if (data.hostClientId == ClientId) {
				SfuClient.joinLobby(data.routerId)
			}

			this.onRouterCreated(this.routers[data.routerId])
		})

		SocketClient.onServerMessage("SFU_NEW_CONNECTION", data => {
			const router = this.routers[data.routerId]

			if (router) {
				router.connectedClientIds.addIfMissing(data.newlyConnectedClientId)
			}

			if (data.newlyConnectedClientId == ClientId) {
				Webcam.request(async (ok) => {
					if (ok) {
						await Webcam.enable()

						SfuRouters.onLocalConnection(Webcam.stream)
					}
				})
			}

			console.log(this.routers)

			this.onJoinLobby(router)
		})

		SocketClient.onServerMessage("SFU_NEW_PRODUCER", async data => {
			console.log("Consuming New Producer")
			SfuClient.consume(data.producerId, data.clientId)
		})
    }

	// Does not work if is directly inside init()
	static updateRouterList() {
		SocketClient.sendToServer("SFU_GET_ROUTER_LIST", {})
	}
}
