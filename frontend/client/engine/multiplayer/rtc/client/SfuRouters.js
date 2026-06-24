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

			const router = SfuRouters.routers[SfuClient.connectedRouterId]

			const device = new window.mediasoup.Device()
			await device.load({ routerRtpCapabilities: data.rtpCapabilities })

			// Enable Local Webcam *Only* for Hosts *Only* when Stream Mode is On / Enable Local Webcam For All
			if (!router.streamOnly || SfuClient.isHost) {
				Webcam.request(
					async (ok) => {
						if (ok) {
							await Webcam.enable()

							SfuRouters.onLocalConnection(Webcam.cam)

							// Setup Send Transport after Webcam is Enabled
							await SfuClient.setupSendTransport(data.sendTransportParams)
						}
						else {
							throw new Error("webcam permission not granted")
						}
					}
				)
			}

			// Setup Recv Transport *Only* for Viewers *Only* when Stream Mode is On / Setup Recv Transport For All
			if (!router.streamOnly || !SfuClient.isHost) {
				await SfuClient.setupRecvTransport(data.recvTransportParams)

				console.log("Getting Producers...")
				SocketClient.sendToServer("SFU_GET_EXISTING_PRODUCERS", {
					routerId: SfuClient.connectedRouterId,
				})
			}
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

			if (data.hostClientId == My.clientId) {
				console.log("Joining Created Lobby...")
				SfuClient.joinLobby(data.routerId)
			}

			this.onRouterCreated(this.routers[data.routerId])
		})

		SocketClient.onServerMessage("SFU_NEW_CONNECTION", data => {
			const router = this.routers[data.routerId]

			if (router) {
				router.connectedClientIds.addIfMissing(data.newlyConnectedClientId)
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
