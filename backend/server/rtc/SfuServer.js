import { randomUUID } from "crypto"

const Random = { // to make it easy to replace with actual Random.js later
	uuid: () => randomUUID()
}

export class SfuServer {
	static {
		this.globalWorker = null
		this.routers = {}
	}

	static async start() {
		this.globalWorker = await SfuServerApi.createWorker()

		SocketServer.on("SFU_DELETE_ROUTER", (client, clientId, data) => {
			if (this.routers[data.routerId] && this.routers[data.routerId].hostClientId == clientId) {
				Object.keys(this.routers[data.routerId].clients).forEach(clientId => {
					this.closeConnectionWithClient(clientId, data.routerId)
				})

				delete this.routers[data.routerId]

				SocketServer.sendToEveryone({
					action: "SFU_ROUTER_DELETED",
					routerId: data.routerId
				})
			}
			else {
				throw new Error(`Router ${data.routerId} Does Not Exist`)
			}
		})

		SocketServer.on("SFU_GET_ROUTER_LIST", (client, clientId) => {
			const routerList = {}

			Object.values(this.routers).forEach(router => {
				routerList[router.routerId] = {
					routerId: router.routerId,
					hostClientId: router.hostClientId,
					connectedClientIds: this.getRouterClientIds(router.routerId),
					streamOnly: router.streamOnly,
				}
			})

			console.log("Sending Router List: ", routerList)

			SocketServer.sendToClient(client, {
				action: "SFU_UPDATE_ROUTER_LIST",
				routerList: routerList
			})
		})

		SocketServer.on("SFU_CREATE_ROUTER", async (client, clientId, data) => {
			const routerObject = await this.createUniqueRouter(this.globalWorker, clientId, data.streamOnly)

			SocketServer.sendToEveryone({
				action: "SFU_ROUTER_CREATED",
				routerId: routerObject.routerId,
				hostClientId: clientId,
				connectedClientIds: [clientId],
				streamOnly: data.streamOnly,
			})
		})

		SocketServer.on("SFU_CONNECT_ROUTER", async (client, clientId, data) => {
			if (Object.hasOwn(this.routers, data.routerId)) {
				this.routers[data.routerId].clients[clientId] = {}

				await this.connectWithClient(client, clientId, data.routerId)

				SocketServer.sendToEveryone({
					action: "SFU_NEW_CONNECTION",
					routerId: data.routerId,
					newlyConnectedClientId: clientId,
				})
			}
			else {
				console.error(`Router ${data.routerId} Does Not Exist`)
			}
		})

		SocketServer.on("SFU_DISCONNECT_ROUTER", async (client, clientId, data) => {
			this.closeConnectionWithClient(clientId, data.routerId)
		})

		SocketServer.on("SFU_CONNECT_TRANSPORT", async (client, clientId, data) => {
			console.log(`Connecting Webrtc Transport For ${clientId}`)

			const router = this.routers[data.routerId]

			if (data.direction == "send") {
				await router.clients[clientId].sendTransport.connect({ dtlsParameters: data.dtlsParameters })
			}
			else {
				await router.clients[clientId].recvTransport.connect({ dtlsParameters: data.dtlsParameters })
			}
		})

		SocketServer.on("SFU_GET_EXISTING_PRODUCERS", (client, clientId, data) => {
			const router = this.routers[data.routerId]

			Object.values(router.clients).forEach(rtcClient => {
				if (rtcClient.client == client) {
					return
				}

				Object.keys(rtcClient.producers).forEach(producerId => {
					SocketServer.sendToClient(client, {
						action: "SFU_NEW_PRODUCER",
						producerId: producerId,
						clientId: rtcClient.clientId
					})
				})

				SocketServer.sendToClient(client, {
					action: "SFU_NEW_DATA_PRODUCER",
					producerId: rtcClient.dataProducer.id,
					clientId: rtcClient.clientId
				})
			})
		})

		SocketServer.on("SFU_REQUEST_PRODUCE", async (client, clientId, data) => {
			const routerObject = this.routers[data.routerId]

			const producer = await routerObject.clients[clientId].sendTransport.produce({
				kind: data.kind,
				rtpParameters: data.rtpParameters
			})

			routerObject.clients[clientId].producers[producer.id] = producer

			SocketServer.sendToClient(client, {
				action: "SFU_CONFIRM_PRODUCE",
				producerId: producer.id,
				kind: producer.kind,
			})

			Object.values(routerObject.clients).forEach(rtcClient => {
				if (rtcClient.client == client) {
					return
				}

				SocketServer.sendToClient(rtcClient.client, {
					action: "SFU_NEW_PRODUCER",
					producerId: producer.id,
					clientId: clientId
				})
			})
		})

		SocketServer.on("SFU_REQUEST_PRODUCE_DATA", async (client, clientId, data) => {
			const routerObject = this.routers[data.routerId]

			const producer = await routerObject.clients[clientId].sendTransport.produceData({
				sctpStreamParameters: data.sctpStreamParameters,
				label: data.label,
				protocol: data.protocol,
				appData: data.appData,
			})

			routerObject.clients[clientId].dataProducer = producer

			SocketServer.sendToClient(client, {
				action: "SFU_CONFIRM_PRODUCE_DATA",
				producerId: producer.id,
			})

			Object.values(routerObject.clients).forEach(rtcClient => {
				if (rtcClient.client == client) {
					return
				}

				SocketServer.sendToClient(rtcClient.client, {
					action: "SFU_NEW_DATA_PRODUCER",
					producerId: producer.id,
					clientId: clientId
				})
			})
		})

		SocketServer.on("SFU_REQUEST_CONSUME", async (client, clientId, data) => {
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

			SocketServer.sendToClient(client, {
				action: "SFU_CONFIRM_CONSUME",
				consumerParams: {
					id: consumer.id,
					producerId: data.producerId,
					kind: consumer.kind,
					rtpParameters: consumer.rtpParameters
				}
			})
		})

		SocketServer.on("SFU_REQUEST_CONSUME_DATA", async (client, clientId, data) => {
			const routerObject = this.routers[data.routerId]

			const consumer = await routerObject.clients[clientId].recvTransport.consumeData({
				dataProducerId: data.producerId,
			})

			SocketServer.sendToClient(client, {
				action: "SFU_CONFIRM_CONSUME_DATA",
				consumerParams: {
					id: consumer.id,
					dataProducerId: data.producerId,
					sctpStreamParameters: consumer.sctpStreamParameters,
					label: consumer.label,
					protocol: consumer.protocol
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

		routerObject.clients[clientId] = { clientId, client, sendTransport, recvTransport, producers: {}, dataProducer: null }

		SocketServer.sendToClient(client, {
			action: "SFU_SETUP_CLIENT",
			rtpCapabilities: router.rtpCapabilities,
			sendTransportParams: {
				id: sendTransport.id,
				iceParameters: sendTransport.iceParameters,
				iceCandidates: sendTransport.iceCandidates,
				dtlsParameters: sendTransport.dtlsParameters,
				rtpParameters: sendTransport.rtpParameters,
				sctpParameters: sendTransport.sctpParameters
			},
			recvTransportParams: {
				id: recvTransport.id,
				iceParameters: recvTransport.iceParameters,
				iceCandidates: recvTransport.iceCandidates,
				dtlsParameters: recvTransport.dtlsParameters,
				rtpParameters: recvTransport.rtpParameters,
				sctpParameters: recvTransport.sctpParameters
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

				Object.values(state.producers).forEach(producer => {
					producer.close()
				})

				if (state.dataProducer) {
					state.dataProducer.close()
				}

				state.sendTransport.close()
				state.recvTransport.close()

				delete this.routers[rid].clients[clientId]

				Object.values(this.routers[rid].clients).forEach(clientObject => {
					SocketServer.sendToClient(clientObject.client, {
						action: "SFU_DISCONNECT_CONSUMER",
						clientId: clientId,
						routerId: rid,
					})
				})
			}
		}
	}

	static async createUniqueRouter(worker, hostClientId, streamOnly) {
		const routerId = Random.uuid()
		const router = await SfuServerApi.createRouter(worker)

		this.routers[routerId] = {
			routerId: routerId,
			router: router,
			hostClientId: hostClientId,
			clients: {},
			streamOnly: streamOnly,
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
