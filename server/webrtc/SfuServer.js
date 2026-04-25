import { SfuServerApi } from "#root/server/webrtc/SfuServerApi.js"
import { socketServer } from "#root/server/socket/SocketServer.js"

const worker = await SfuServerApi.createWorker()
console.log(worker)
const globalRouter = await SfuServerApi.createRouter(worker)

export function SfuServer_start() {
    console.log("y")
    console.log(socketServer)

    socketServer.onConnection = (client, clientId) => {
        const transport = SfuServerApi.createTransport(globalRouter)

        socketServer.sendToClient(client, {
            action: "CREATE_WEBRTC_SEND_TRANSPORT",
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
            sctpParameters: transport.sctpParameters
        })
    }
}