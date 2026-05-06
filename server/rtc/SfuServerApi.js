import * as mediasoup from 'mediasoup'

export class SfuServerApi {
    static async createWorker() {
        const worker = await mediasoup.createWorker();
        
        return worker;
    }

    static async createRouter(worker) {
        const mediaCodecs =
        [
            {
                kind: "audio",
                mimeType: "audio/opus",
                clockRate: 48000,
                channels: 2
            },
            {
                kind: "video",
                mimeType: "video/H264",
                clockRate: 90000,
                parameters:
                {
                    "packetization-mode": 1,
                    "profile-level-id": "42e01f",
                    "level-asymmetry-allowed": 1
                }
            }
        ]

        const router = await worker.createRouter({ mediaCodecs })

        return router
    }

    static async createTransport(router) {
        const transport = await router.createWebRtcTransport({
            listenIps: [{ ip: "0.0.0.0", announcedIp: "127.0.0.1" }],
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
        })
        
        transport.on("dtlsstatechange", (dtlsState) => {
            if (dtlsState === "closed") {
                transport.close()
            }
        })
        
        transport.on("@close", () => {
            console.warn("Webrtc Transport Closed")
        });
        
        return transport;
    }
}