import SocketServer from './SimplifiedSocketServerAPI.js'
import mediasoup from 'mediasoup'

const socketServer = new SocketServer(8082)

// --- Mediasoup setup ---
const workers = []
let router
const rooms = new Map()

async function createWorker() {
    const worker = await mediasoup.createWorker({
        rtcMinPort: 20000,
        rtcMaxPort: 20100,
        logLevel: 'warn',
        logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp']
    })

    worker.on('died', () => {
        console.error('mediasoup worker died, exiting...')
        process.exit(1)
    })

    return worker
}

async function initMediasoup() {
    const worker = await createWorker()

    router = await worker.createRouter({
        mediaCodecs: [
            { kind: 'audio', mimeType: 'audio/opus', clockRate: 48000, channels: 2 },
            { kind: 'video', mimeType: 'video/VP8', clockRate: 90000 }
        ]
    })

    rooms.set('default', { router, peers: new Map() })
}

await initMediasoup()

// --- SocketServer handlers ---
socketServer.onConnection = (client, clientId) => {
    console.log(`${clientId} connected`)

    socketServer.sendToEveryone({
        action: 'UPDATE_CLIENTS_LIST',
        clientIds: socketServer.allClientIds,
        originClientId: clientId
    })
}

socketServer.on('CLIENT_TO_CLIENT', (client, clientId, data) => {
    const index = socketServer.allClientIds.indexOf(data.targetClientId)
    const targetClient = socketServer.allClients[index]
    socketServer.sendToClient(targetClient, data)
})

// --- Mediasoup signaling ---
socketServer.on('getRouterRtpCapabilities', (client, clientId, callback) => {
    callback(router.rtpCapabilities)
})

socketServer.on('createWebRtcTransport', async (client, clientId, { direction }, callback) => {
    const transport = await rooms.get('default').router.createWebRtcTransport({
        listenIps: [{ ip: '0.0.0.0', announcedIp: null }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true
    })

    rooms.get('default').peers.set(clientId, rooms.get('default').peers.get(clientId) || {})
    const peer = rooms.get('default').peers.get(clientId)
    peer[direction + 'Transport'] = transport

    callback({
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters
    })
})

socketServer.on('connectTransport', (client, clientId, { dtlsParameters }) => {
    const peer = rooms.get('default').peers.get(clientId)
    const transport = peer.sendTransport || peer.recvTransport
    transport.connect({ dtlsParameters })
})

socketServer.on('produce', async (client, clientId, { kind, rtpParameters }, callback) => {
    const peer = rooms.get('default').peers.get(clientId)
    const transport = peer.sendTransport
    const producer = await transport.produce({ kind, rtpParameters })
    peer.producer = producer

    // Notify all other clients to consume this producer
    for (const [otherId, otherPeer] of rooms.get('default').peers) {
        if (otherId !== clientId) {
            socketServer.sendToClient(socketServer.allClients[socketServer.allClientIds.indexOf(otherId)], {
                action: 'NEW_PRODUCER',
                producerId: producer.id,
                producerClientId: clientId
            })
        }
    }

    callback(producer.id)
})

socketServer.on('consume', async (client, clientId, { producerId }, callback) => {
    const peer = rooms.get('default').peers.get(clientId)
    peer.recvTransport = peer.recvTransport || await rooms.get('default').router.createWebRtcTransport({
        listenIps: [{ ip: '0.0.0.0', announcedIp: null }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true
    })

    const consumer = await peer.recvTransport.consume({
        producerId,
        rtpCapabilities: rooms.get('default').router.rtpCapabilities,
        paused: false
    })

    peer.consumers = peer.consumers || new Map()
    peer.consumers.set(producerId, consumer)

    callback({
        producerId,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters
    })
})

socketServer.onClose = (client, clientId) => {
    console.log(`${clientId} disconnected`)
    rooms.get('default').peers.delete(clientId)

    socketServer.sendToEveryone({
        action: 'REMOVE_CLIENT',
        clientId
    })
}

socketServer.start()

