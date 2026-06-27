import * as mediasoup from "mediasoup"

export class SfuServerApi {
	static async createWorker() {
		const worker = await mediasoup.createWorker()

		return worker
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
	  // Create a WebRTC transport using the new listenInfos API
	  const transport = await router.createWebRtcTransport({
			listenInfos: [
				{
					protocol: "udp",
					ip: "0.0.0.0",
					announcedAddress: "krispetter.duckdns.org", // Public DNS name or IP // todo put this into Config.js later
					portRange: { min: 40000, max: 49999 } // New portRange replaces rtcMin/rtcMax
				},
				{
					protocol: "tcp",
					ip: "0.0.0.0",
					announcedAddress: "krispetter.duckdns.org", // todo put this into Config.js later // and find out what it should be set to for working locally
					portRange: { min: 40000, max: 49999 }
				}
			],
			enableUdp: true,
			enableTcp: true,
			preferUdp: true
	  })

	  // Close transport when DTLS state is closed
	  transport.on("dtlsstatechange", (dtlsState) => {
			if (dtlsState == "closed") {
				transport.close()
			}
	  })

	  // Handle transport close event
	  transport.on("close", () => {
			console.warn("WebRTC Transport closed")
	  })

	  return transport
	}



}
