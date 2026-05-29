import { SfuServerApi } from "#root/server/rtc/SfuServerApi.js"
import { socketServer } from "#root/server/socket/SocketServer.js"
import { RandomId } from "#root/dev/build_tools/RandomId.js"

export class SfuServer {
	static {
		this.globalWorker = null
		this.routers = {}
	}

	static async start() {
		this.globalWorker = await SfuServerApi.createWorker()

		socketServer.on("SFU_DELETE_ROUTER", (client, clientId, data) => {
			if (this.routers[data.routerId] && this.routers[data.routerId].hostClientId == clientId) {
				Object.keys(this.routers[data.routerId].clients).forEach(clientId => {
					this.closeConnectionWithClient(clientId, data.routerId)
				})

				delete this.routers[data.routerId]

				socketServer.sendToEveryone({
					action: "SFU_ROUTER_DELETED",
					routerId: data.routerId
				})
			}
			else {
				throw new Error(`Router ${data.routerId} Does Not Exist`)
			}
		})

		socketServer.on("SFU_GET_ROUTER_LIST", (client, clientId) => {
			const routerList = {}

			Object.values(this.routers).forEach(router => {
				routerList[router.routerId] = {
					routerId: router.routerId,
					hostClientId: router.hostClientId,
					connectedClientIds: this.getRouterClientIds(router.routerId)
				}
			})

			console.log("Sending Router List: ", routerList)

			socketServer.sendToClient(client, {
				action: "SFU_UPDATE_ROUTER_LIST",
				routerList: routerList
			})
		})

		socketServer.on("SFU_CREATE_ROUTER", async (client, clientId) => {
			const routerObject = await this.createUniqueRouter(this.globalWorker, clientId)

			socketServer.sendToEveryone({
				action: "SFU_ROUTER_CREATED",
				routerId: routerObject.routerId,
				hostClientId: clientId,
				connectedClientIds: [clientId]
			})
		})

		socketServer.on("SFU_CONNECT_ROUTER", async (client, clientId, data) => {
			if (Object.hasOwn(this.routers, data.routerId)) {
				this.routers[data.routerId].clients[clientId] = {}

				await this.connectWithClient(client, clientId, data.routerId)

				socketServer.sendToEveryone({
					action: "SFU_NEW_CONNECTION",
					routerId: data.routerId,
					newlyConnectedClientId: clientId
				})
			}
			else {
				console.error(`Router ${data.routerId} Does Not Exist`)
			}
		})

		socketServer.on("SFU_DISCONNECT_ROUTER", async (client, clientId, data) => {
			this.closeConnectionWithClient(clientId, data.routerId)
		})

		socketServer.on("SFU_CONNECT_TRANSPORT", async (client, clientId, data) => {
			console.log(`Connecting Webrtc Transport For ${clientId}`)

			const router = this.routers[data.routerId]

			if (data.direction == "send") {
				await router.clients[clientId].sendTransport.connect({ dtlsParameters: data.dtlsParameters })
			}
			else {
				await router.clients[clientId].recvTransport.connect({ dtlsParameters: data.dtlsParameters })
			}
		})

		socketServer.on("SFU_GET_EXISTING_PRODUCERS", (client, clientId, data) => {
			const router = this.routers[data.routerId]

			Object.values(router.clients).forEach(rtcClient => {
				if (rtcClient.client == client) {
					return
				}

				socketServer.sendToClient(client, {
					action: "SFU_NEW_PRODUCER",
					producerId: rtcClient.producer.id,
					clientId: rtcClient.clientId
				})
			})
		})

		socketServer.on("SFU_REQUEST_PRODUCE", async (client, clientId, data) => {
			const routerObject = this.routers[data.routerId]

			const producer = await routerObject.clients[clientId].sendTransport.produce({
				kind: data.kind,
				rtpParameters: data.rtpParameters
			})

			routerObject.clients[clientId].producer = producer

			socketServer.sendToClient(client, {
				action: "SFU_CONFIRM_PRODUCE",
				producerId: producer.id,
				kind: producer.kind,
			})

			Object.values(routerObject.clients).forEach(rtcClient => {
				if (rtcClient.client == client) {
					return
				}

				socketServer.sendToClient(rtcClient.client, {
					action: "SFU_NEW_PRODUCER",
					producerId: producer.id,
					clientId: clientId
				})
			})
		})

		socketServer.on("SFU_REQUEST_CONSUME", async (client, clientId, data) => {
			const routerObject = this.routers[data.routerId]

			if (!routerObject.router.canConsume({ producerId: data.producerId, rtpCapabilities: data.rtpCapabilities })) {
				console.error("Cannot consume")
				return
			}

			const consumer = await routerObject.clients[clientId].recvTransport.consume({
				producerId: data.producerId,
				rtpCapabilities: data.rtpCapabilities,
				paused: false
			})

			socketServer.sendToClient(client, {
				action: "SFU_CONFIRM_CONSUME",
				consumerParams: {
					id: consumer.id,
					producerId: data.producerId,
					kind: consumer.kind,
					rtpParameters: consumer.rtpParameters
				}
			})
		})
	}

	static async connectWithClient(client, clientId, routerId) {
		console.log(`Connecting With ${clientId}`)

		const routerObject = this.routers[routerId]
		const router = routerObject.router

		const sendTransport = await SfuServerApi.createTransport(router)
		const recvTransport = await SfuServerApi.createTransport(router)

		routerObject.clients[clientId] = { clientId, client, sendTransport, recvTransport, producer: null }

		socketServer.sendToClient(client, {
			action: "SFU_SETUP_CLIENT",
			rtpCapabilities: router.rtpCapabilities,
			sendTransportParams: {
				id: sendTransport.id,
				iceParameters: sendTransport.iceParameters,
				iceCandidates: sendTransport.iceCandidates,
				dtlsParameters: sendTransport.dtlsParameters,
			},
			recvTransportParams: {
				id: recvTransport.id,
				iceParameters: recvTransport.iceParameters,
				iceCandidates: recvTransport.iceCandidates,
				dtlsParameters: recvTransport.dtlsParameters,
			}
		})
	}

	static closeConnectionWithClient(clientId, routerId = null) {
		console.log(`Disconnecting With ${clientId}`)

		let rid = null

		if (!routerId) {
			rid = this.getClientRouterId(clientId)
		}
		else {
			rid = routerId
		}

		if (rid) {
			if (Object.hasOwn(this.routers, rid)) {
				const state = this.routers[rid].clients[clientId]

				if (state.producer) {
					state.producer.close()
					state.sendTransport.close()
					state.recvTransport.close()
				}

				delete this.routers[rid].clients[clientId]

				Object.values(this.routers[rid].clients).forEach(clientObject => {
					socketServer.sendToClient(clientObject.client, {
						action: "SFU_DISCONNECT_CONSUMER",
						clientId: clientId,
						routerId: rid
					})
				})
			}
		}
	}

	static async createUniqueRouter(worker, hostClientId) {
		const routerId = RandomId()
		const router = await SfuServerApi.createRouter(worker)

		this.routers[routerId] = {
			routerId: routerId,
			router: router,
			hostClientId: hostClientId,
			clients: {}
		}

		return this.routers[routerId]
	}

	static getClientRouterId(clientId) {
		let routerId = ""

		Object.values(this.routers).forEach(routerObject => {
			Object.values(routerObject.clients).forEach(clientObject => {
				if (clientObject.clientId == clientId) {
					routerId = routerObject.routerId
				}
			})
		})

		return routerId
	}

	static getRouterClientIds(routerId) {
		const connectedClientIds = []

		if (this.routers[routerId]) {
			Object.keys(this.routers[routerId].clients).forEach(clientId => {
				connectedClientIds.push(clientId)
			})
		}

		return connectedClientIds
	}
}
