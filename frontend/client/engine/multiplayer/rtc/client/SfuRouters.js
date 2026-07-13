export class SfuRouters {
	static init() {
		this.routers = {}

		this.onRouterCreated = (router) => {}
		this.onRouterDeleted = (routerId) => {}
		this.onGuestConnection = (stream) => {}
		this.onLocalConnection = () => {}
		this.onJoinRouter = (router) => {}
		this.onLeaveRouter = (router) => {}
		this.onMessage = (clientId, data) => {}

		SocketClient.onClientMessage("SFU_MESSAGE", data => {
			this.onMessage(data.originClientId, data.message)
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

			Object.keys(this.routers).forEach(routerId => {
				this.onRouterCreated(this.routers[routerId])
			})
		})

		SocketClient.onServerMessage("SFU_SETUP_CLIENT", async data => {
			console.log("Setting Up SFU Client")

			const router = this.routers[SfuClient.connectedRouterId]

			SfuClient.device = new window.mediasoup.Device()
			await SfuClient.device.load({ routerRtpCapabilities: data.rtpCapabilities })

			// Enable Local Webcam *Only* for Hosts *Only* when Stream Mode is On / Enable Local Webcam For All
			if (!router.streamOnly || SfuClient.isHost) {
				Webcam.request(
					async (ok) => {
						if (ok) {
							await Webcam.enable()
							Webcam.routeTo(SfuClient.videoStream)

							this.onLocalConnection()

							// Setup Send Transport after Webcam is Enabled
							await SfuClient.setupSendTransport(data.sendTransportParams)
						}
						else {
							throw new Error("webcam permission not granted")
						}
					}
				)

				await Microphone.enable()
				SfuClient.audioStream.routeTo(Mix.mic)
				Mix.master.volume = 0
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

			SfuClient.consume(data.producerId, data.clientId)
		})

		setTimeout(() => {
			// hack to wait for server to connect. todo fix
			SocketClient.sendToServer("SFU_GET_ROUTER_LIST", {})
		}, 1_000)
	}
}