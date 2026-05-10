import { SfuServerApi } from "#root/server/rtc/SfuServerApi.js"
import { socketServer } from "#root/server/socket/SocketServer.js"
import RandomId from "#root/dev/build_tools/RandomId.js"

export class SfuServer {
    static {
        this.globalWorker = null
        this.routers = {}
    }

    static async start() {
        this.globalWorker = await SfuServerApi.createWorker()

        socketServer.on("SFU_CREATE_ROUTER", async (client, clientId) => {
            const routerObject = await this.createUniqueRouter(this.globalWorker)

            socketServer.sendToClient(client, {
                action: "SFU_ROUTER_CREATED",
                routerId: routerObject.routerId
            })
        })

        socketServer.on("SFU_CONNECT_ROUTER", async (client, clientId, data) => {
            this.connectClientExistingRouter(clientId, data.routerId)
            await this.connectWithClient(client, clientId, data.routerId)
        })

        socketServer.on("SFU_DISCONNECT_ROUTER", async (client, clientId, data) => {
            this.closeConnectionWithClient(clientId, data.routerId)
        })

        socketServer.on("SFU_CONNECT_TRANSPORT", async (client, clientId, data) => {
            console.log(`Connecting Webrtc Transport For ${clientId}`)

            const router = this.routers[data.routerId]

            if (data.direction == "send") {
                await router.clients[clientId].sendTransport.connect({ dtlsParameters: data.dtlsParameters })
            } else {
                await router.clients[clientId].recvTransport.connect({ dtlsParameters: data.dtlsParameters })
            }
        })

        socketServer.on("SFU_GET_EXISTING_PRODUCERS", (client, clientId, data) => {
            const router = this.routers[data.routerId]

            Object.values(router.clients).forEach(rtcClient => {
                if (rtcClient.client === client) {
                    return
                }

                socketServer.sendToClient(client, {
                    action: "SFU_NEW_PRODUCER",
                    producerouterId: rtcClient.producer.id,
                    clientId: clientId
                })
            })
        })

        socketServer.on("SFU_REQUEST_PRODUCE", async (client, clientId, data) => {
            const router = this.routers[data.routerId]

            const producer = await router.clients[clientId].sendTransport.produce({
                kind: data.kind,
                rtpParameters: data.rtpParameters
            })

            router.clients[clientId].producer = producer

            socketServer.sendToClient(client, {
                action: "SFU_CONFIRM_PRODUCE",
                producerouterId: producer.id,
                kind: producer.kind,
            })

            Object.values(router.clients).forEach(rtcClient => {
                if (rtcClient.client === client) {
                    return
                }

                socketServer.sendToClient(rtcClient.client, {
                    action: "SFU_NEW_PRODUCER",
                    producerouterId: producer.id,
                    clientId: rtcClient.clientId
                })
            })
        })

        socketServer.on("SFU_REQUEST_CONSUME", async (client, clientId, data) => {
            if (!this.routers[data.routerId].router.canConsume({ producerouterId: data.producerouterId, rtpCapabilities: data.rtpCapabilities })) {
                console.error("Cannot consume")
                return
            }

            const router = this.routers[data.routerId]

            const consumer = await router.clients[clientId].recvTransport.consume({
                producerouterId: data.producerouterId,
                rtpCapabilities: data.rtpCapabilities,
                paused: false
            })

            socketServer.sendToClient(client, {
                action: "SFU_CONFIRM_CONSUME",
                consumerParams: {
                    id: consumer.id,
                    producerouterId: data.producerouterId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters
                }
            })
        })
    }

    static async connectWithClient(client, clientId, routerId) {
        console.log(`Connecting With ${clientId}`)

        if (Object.hasOwn(this.routers, routerId)) {
            const router = this.routers[routerId].router

            const sendTransport = await SfuServerApi.createTransport(router)
            const recvTransport = await SfuServerApi.createTransport(router)

            router.clients[clientId] = { client, sendTransport, recvTransport, producer: null }

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
        } else {
            console.error(`Router ${routerId} Does Not Exist`)
        }
    }

    static closeConnectionWithClient(clientId, routerId) {
        return // TODO: Find A Fix

        console.log(`Disconnecting With ${clientId}`)

        const state = this.rtcClients[clientId]
        if (!state) return

        if (state.producer) state.producer.close()
        state.sendTransport.close()
        state.recvTransport.close()

        delete this.rtcClients[clientId]
    }

    static async createUniqueRouter(worker) {
        const routerId = RandomId()
        const router = await SfuServerApi.createRouter(worker)

        this.routers[routerId] = {
            routerId: routerId,
            router: router,
            clients: {}
        }

        return this.routers[routerId]
    }

    static connectClientExistingRouter(clientId, routerId) {
        if (Object.hasOwn(this.routers, routerId)) {
            if (this.routers[routerId].clients.includes(clientId)) {
                this.routers[routerId].clients.push(clientId)
            }
        }
    }
}