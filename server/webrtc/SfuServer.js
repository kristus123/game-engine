import { SfuServerApi } from "#root/server/webrtc/SfuServerApi.js"
import { socketServer } from "#root/server/socket/SocketServer.js"

export class SfuServer {
    static async start() {
        const worker = await SfuServerApi.createWorker()
        this.globalRouter = await SfuServerApi.createRouter(worker)
        this.rtcClients = {}

        socketServer.on("SFU_CONNECT_TRANSPORT", async (client, clientId, data) => {
            if (data.direction == "send") {
                await this.rtcClients[clientId].sendTransport.connect({ dtlsParameters: data.dtlsParameters })
            } else {
                await this.rtcClients[clientId].recvTransport.connect({ dtlsParameters: data.dtlsParameters })
            }
        })

        socketServer.on("SFU_PRODUCE", async (client, clientId, data) => {
            const producer = await this.rtcClients[clientId].sendTransport.produce({
                kind: data.kind,
                rtpParameters: data.rtpParameters
            })

            this.rtcClients[clientId].producer = producer

            socketServer.sendToClient(client, {
                action: "SFU_PRODUCED",
                producerId: producer.id
            })

            Object.values(this.rtcClients).forEach(rtcClient => {
                if (rtcClient.client === client) {
                    return
                }

                socketServer.sendToClient(rtcClient.client, {
                    action: "SFU_NEW_PRODUCER",
                    producerId: producer.id
                })
            })
        })

        socketServer.on("SFU_CONSUME", async (client, clientId, data) => {
            if (!this.globalRouter.canConsume({ producerId: data.producerId, rtpCapabilities: data.rtpCapabilities })) {
                console.error("Cannot consume")
                return
            }

            const consumer = await this.rtcClients[clientId].recvTransport.consume({
                producerId: data.producerId,
                rtpCapabilities: data.rtpCapabilities,
                paused: false
            })

            socketServer.sendToClient(client, {
                action: "SFU_CONSUMED",
                consumerParams: {
                    id: consumer.id,
                    producerId: data.producerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                }
            })
        })
    }

    static async connectWithClient(client, clientId) {
        const sendTransport = await SfuServerApi.createTransport(this.globalRouter)
        const recvTransport = await SfuServerApi.createTransport(this.globalRouter)

        this.rtcClients[clientId] = { client, sendTransport, recvTransport, producer: null }

        socketServer.sendToClient(client, {
            action: "SFU_SETUP_CLIENT",
            rtpCapabilities: this.globalRouter.rtpCapabilities,
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

        const other = Object.values(this.rtcClients).find(rtcClient => rtcClient.client !== client && rtcClient.producer)
        if (other) {
            socketServer.sendToClient(client, {
                action: "SFU_NEW_PRODUCER",
                producerId: other.producer.id
            })
        }
    }

    static closeConnectionWithClient() {
        socketServer.onClose = (client, clientId) => {
            const state = this.rtcClients[clientId]
            if (!state) return

            if (state.producer) state.producer.close()
            state.sendTransport.close()
            state.recvTransport.close()

            delete this.rtcClients[clientId]
        }
    }
}