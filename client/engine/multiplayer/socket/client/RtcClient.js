export class RtcClient {
    static {
        this.device = null
        this.sendTransport = null
        this.recvTransport = null
        this.localStream = null
        this.producers = {}
        this.consumers = {}         

        SocketClient.onServerMessage("SFU_SETUP_CLIENT", async data => {
            console.log("Setting Up SFU Client")

            const mediaStream = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                return stream
            })

            this.localStream = await mediaStream
            Dom.add([ HtmlVideo.local(this.localStream) ])

            this.device = new window.mediasoup.Device()
			await this.device.load({ routerRtpCapabilities: data.rtpCapabilities })
            await this.setupSendTransport(data.sendTransportParams)
            await this.setupRecvTransport(data.recvTransportParams)
        })

        SocketClient.onServerMessage("SFU_NEW_PRODUCER", async data => {
            console.log("Consuming New Producer")

            await this.consume(data.producerId, data.clientId)
        })
    }

    static async setupSendTransport(params) {
        this.sendTransport = this.device.createSendTransport(params)

        this.sendTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
            try {
                console.log("Requesting Connection For Webrtc Send Transport")
                
                SocketClient.sendToServer("SFU_CONNECT_TRANSPORT", {
                    direction: "send",
                    dtlsParameters
                })
                callback()
            } catch (e) { errback(e) }
        })

        this.sendTransport.on("produce", async ({ kind, rtpParameters }, callback, errback) => {
            try {
                await new Promise(resolve => {
                    SocketClient.serverActionListener.listenOnce("SFU_PRODUCED", data => {
                        if (data.kind === kind) {
                            callback({ id: data.producerId })
                            resolve()
                        }
                    })

                    console.log("Requesting Producer")
                    SocketClient.sendToServer("SFU_PRODUCE", { kind, rtpParameters })
                })
            } catch (e) { errback(e) }
        })

        if (!this.localStream || !this.sendTransport) return

        for (const track of this.localStream.getTracks()) {
            const producer = await this.sendTransport.produce({ track })
            this.producers[track.kind] = producer
        }

        SocketClient.sendToServer("SFU_GET_EXISTING_PRODUCERS", {})
    }

    static async setupRecvTransport(params) {
        this.recvTransport = this.device.createRecvTransport(params)

        this.recvTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
            try {
                console.log("Requesting Connection For Webrtc Recv Transport")

                SocketClient.sendToServer("SFU_CONNECT_TRANSPORT", {
                    direction: "recv",
                    dtlsParameters
                })
                callback()
            } catch (e) {
				errback(e)
			}
        })
    }

    static async consume(producerId, originClientId) {
        if (!this.recvTransport) return

        console.log("Requesting Consumer")

        SocketClient.sendToServer("SFU_CONSUME", {
            producerId,
            rtpCapabilities: this.device.rtpCapabilities
        })

        SocketClient.serverActionListener.listenOnce("SFU_CONSUMED", async data => {
            if (data.consumerParams.producerId !== producerId) return

            const consumer = await this.recvTransport.consume(data.consumerParams)

            const stream = new MediaStream([consumer.track])
            this.consumers[producerId] = { consumer, stream }

			Dom.add([ HtmlVideo.local(stream) ])
        })
    }
}