import { randomUUID } from "crypto"

const Random = { // to make it easy to replace with actual Random.js later // nabir todo
	uuid: () => randomUUID()
}

export class SfuServer {
	static {
		this.globalWorker = null
		this.routers = {}
	}

	static async start() {
		this.globalWorker = await SfuServerApi.createWorker()

		SocketServer.on("SFU_DELETE_ROUTER", ({ userId, data }) => {
			if (this.routers[data.routerId] && this.routers[data.routerId].hostUserId == userId) {
				Object.keys(this.routers[data.routerId].clients).forEach(userId => {
					this.closeConnectionWithUser(userId, data.routerId)
				})

				delete this.routers[data.routerId]

				SocketServer.sendToEveryone({
					data: { routerId: data.routerId },
					metaHeaders: {
						action: "SFU_ROUTER_DELETED",
						originUserId: userId,
					},
				})
			}
			else {
				throw new Error(`Router ${data.routerId} Does Not Exist`)
			}
		})

		SocketServer.on("SFU_GET_ROUTER_LIST", ({ client }) => {
			const routerList = {}

			Object.values(this.routers).forEach(router => {
				routerList[router.routerId] = {
					routerId: router.routerId,
					hostUserId: router.hostUserId,
					connectedUserIds: this.getRouterUserIds(router.routerId),
					streamOnly: router.streamOnly,
				}
			})

			console.log("Sending Router list: ", routerList)

			SocketServer.sendToClient(client, {
				data: { routerList: routerList },
				metaHeaders: { action: "SFU_UPDATE_ROUTER_LIST" },
			})
		})

		SocketServer.on("SFU_CREATE_ROUTER", async ({ userId, data }) => {
			const routerObject = await this.createUniqueRouter(this.globalWorker, userId, data.streamOnly)

			SocketServer.sendToEveryone({
				data: {
					routerId: routerObject.routerId,
					connectedUserIds: [userId],
					streamOnly: data.streamOnly,
				},
				metaHeaders: {
					action: "SFU_ROUTER_CREATED",
					originUserId: userId,
				},
			})
		})

		SocketServer.on("SFU_CONNECT_ROUTER", async ({ client, userId, data }) => {
			if (Object.hasOwn(this.routers, data.routerId)) {
				this.routers[data.routerId].clients[userId] = {}

				await this.connectWithClient(client, userId, data.routerId)

				SocketServer.sendToEveryone({
					data: { routerId: data.routerId },
					metaHeaders: {
						action: "SFU_NEW_CONNECTION",
						originUserId: userId,
					},
				})
			}
			else {
				console.error(`Router ${data.routerId} Does Not Exist`)
			}
		})

		SocketServer.on("SFU_DISCONNECT_ROUTER", async ({ userId, data }) => {
			this.closeConnectionWithUser(userId, data.routerId)
		})

		SocketServer.on("SFU_CONNECT_TRANSPORT", async ({ client, userId, data }) => {
			console.log(`Connecting Webrtc Transport For ${userId}`)

			const router = this.routers[data.routerId]

			if (data.direction == "send") {
				await router.clients[userId].sendTransport.connect({ dtlsParameters: data.dtlsParameters })
			}
			else {
				await router.clients[userId].recvTransport.connect({ dtlsParameters: data.dtlsParameters })
			}

			SocketServer.sendToClient(client, {
				metaHeaders: { action: "SFU_TRANSPORT_CONNECTED" },
			})
		})

		SocketServer.on("SFU_GET_EXISTING_PRODUCERS", ({ client, userId, data }) => {
			const router = this.routers[data.routerId]

			Object.values(router.clients).forEach(rtcClient => {
				if (rtcClient.client == client) {
					return
				}

				Object.keys(rtcClient.producers).forEach(producerId => {
					SocketServer.sendToClient(client, {
						data: { producerId: producerId },
						metaHeaders: {
							action: "SFU_NEW_PRODUCER",
							originUserId: rtcClient.userId,
						},
					})
				})

				SocketServer.sendToClient(client, {
					data: { producerId: rtcClient.dataProducer.id },
					metaHeaders: {
						action: "SFU_NEW_DATA_PRODUCER",
						originUserId: rtcClient.userId,
					},
				})
			})
		})

		SocketServer.on("SFU_REQUEST_PRODUCE", async ({ client, userId, data }) => {
			const routerObject = this.routers[data.routerId]

			const producer = await routerObject.clients[userId].sendTransport.produce({
				kind: data.kind,
				rtpParameters: data.rtpParameters
			})

			routerObject.clients[userId].producers[producer.id] = producer

			SocketServer.sendToClient(client, {
				data: {
					producerId: producer.id,
					kind: producer.kind,
				},
				metaHeaders: { action: "SFU_CONFIRM_PRODUCE" },
			})

			Object.values(routerObject.clients).forEach(rtcClient => {
				if (rtcClient.client == client) {
					return
				}

				SocketServer.sendToClient(rtcClient.client, {
					data: { producerId: producer.id },
					metaHeaders: {
						action: "SFU_NEW_PRODUCER",
						originUserId: userId,
					},
				})
			})
		})

		SocketServer.on("SFU_REQUEST_PRODUCE_DATA", async ({ client, userId, data }) => {
			const routerObject = this.routers[data.routerId]

			const producer = await routerObject.clients[userId].sendTransport.produceData({
				sctpStreamParameters: data.sctpStreamParameters,
				label: data.label,
				protocol: data.protocol,
				appData: data.appData,
			})

			routerObject.clients[userId].dataProducer = producer

			SocketServer.sendToClient(client, {
				data: { producerId: producer.id },
				metaHeaders: { action: "SFU_CONFIRM_PRODUCE_DATA" },
			})

			Object.values(routerObject.clients).forEach(rtcClient => {
				if (rtcClient.client == client) {
					return
				}

				SocketServer.sendToClient(rtcClient.client, {
					data: { producerId: producer.id },
					metaHeaders: {
						action: "SFU_NEW_DATA_PRODUCER",
						originUserId: userId,
					},
				})
			})
		})

		SocketServer.on("SFU_REQUEST_CONSUME", async ({ client, userId, data }) => {
			const routerObject = this.routers[data.routerId]

			if (!routerObject.router.canConsume({ producerId: data.producerId, rtpCapabilities: data.rtpCapabilities })) {
				console.error("Cannot consume")
				return
			}

			const consumer = await routerObject.clients[userId].recvTransport.consume({
				producerId: data.producerId,
				rtpCapabilities: data.rtpCapabilities,
				paused: false
			})

			SocketServer.sendToClient(client, {
				data: {
					consumerParams: {
						id: consumer.id,
						producerId: data.producerId,
						kind: consumer.kind,
						rtpParameters: consumer.rtpParameters
					},
				},
				metaHeaders: { action: "SFU_CONFIRM_CONSUME" },
			})
		})

		SocketServer.on("SFU_REQUEST_CONSUME_DATA", async ({ client, userId, data }) => {
			const routerObject = this.routers[data.routerId]

			const consumer = await routerObject.clients[userId].recvTransport.consumeData({
				dataProducerId: data.producerId,
			})

			SocketServer.sendToClient(client, {
				data: {
					consumerParams: {
						id: consumer.id,
						dataProducerId: data.producerId,
						sctpStreamParameters: consumer.sctpStreamParameters,
						label: consumer.label,
						protocol: consumer.protocol
					},
				},
				metaHeaders: { action: "SFU_CONFIRM_CONSUME_DATA" },
			})
		})
	}

	static async stop() {
		for (const routerObject of Object.values(this.routers)) {
			try {
				routerObject.router.close()
			}
			catch (error) {
				console.error("Error closing mediasoup router", error)
			}
		}
		this.routers = {}

		const worker = this.globalWorker
		this.globalWorker = null
		if (worker && !worker.closed) {
			worker.close()
		}
	}



	static async connectWithClient(client, userId, routerId) {
		console.log(`Connecting With ${userId}`)

		const routerObject = this.routers[routerId]
		const router = routerObject.router

		const sendTransport = await SfuServerApi.createTransport(router)
		const recvTransport = await SfuServerApi.createTransport(router)

		routerObject.clients[userId] = { userId, client, sendTransport, recvTransport, producers: {}, dataProducer: null }

		SocketServer.sendToClient(client, {
			data: {
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
				},
			},
			metaHeaders: { action: "SFU_SETUP_CLIENT" },
		})
	}

	static closeConnectionWithUser(userId, routerId = null) { // no-null-check
		console.log(`Disconnecting With ${userId}`)

		let rid = null

		if (!routerId) {
			rid = this.getUserRouterId(userId)
		}
		else {
			rid = routerId
		}

		if (rid) {
			if (Object.hasOwn(this.routers, rid)) {
				const state = this.routers[rid].clients[userId]

				Object.values(state.producers).forEach(producer => {
					producer.close()
				})

				if (state.dataProducer) {
					state.dataProducer.close()
				}

				state.sendTransport.close()
				state.recvTransport.close()

				delete this.routers[rid].clients[userId]

				Object.values(this.routers[rid].clients).forEach(clientObject => {
					SocketServer.sendToClient(clientObject.client, {
						data: {
							routerId: rid,
						},
						metaHeaders: {
							action: "SFU_DISCONNECT_CONSUMER",
							originUserId: userId,
						},
					})
				})
			}
		}
	}

	static async createUniqueRouter(worker, hostUserId, streamOnly) {
		const routerId = Random.uuid()
		const router = await SfuServerApi.createRouter(worker)

		this.routers[routerId] = {
			routerId: routerId,
			router: router,
			hostUserId: hostUserId,
			clients: {},
			streamOnly: streamOnly,
		}

		return this.routers[routerId]
	}

	static getUserRouterId(userId) {
		let routerId = ""

		Object.values(this.routers).forEach(routerObject => {
			Object.values(routerObject.clients).forEach(clientObject => {
				if (clientObject.userId == userId) {
					routerId = routerObject.routerId
				}
			})
		})

		return routerId
	}

	static getRouterUserIds(routerId) {
		const connectedUserIds = []

		if (this.routers[routerId]) {
			Object.keys(this.routers[routerId].clients).forEach(userId => {
				connectedUserIds.push(userId)
			})
		}

		return connectedUserIds
	}
}
