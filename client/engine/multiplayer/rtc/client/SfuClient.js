export class SfuClient {
    static {
        this.connectedRouterId = null
        this.device = null
        this.sendTransport = null
        this.recvTransport = null
        this.localStream = null
        this.producers = {}
        this.consumers = {}         

        SocketClient.onServerMessage("SFU_ROUTER_CREATED", data => {
            this.connectedRouterId = data.routerId
            this.connect(this.connectedRouterId)
        })

        SocketClient.onServerMessage("SFU_SETUP_CLIENT", async data => {
            console.log("Setting Up SFU Client")

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
                    dtlsParameters: dtlsParameters,
                    routerId: this.connectedRouterId
                })
                callback()
            } catch (e) { errback(e) }
        })

        this.sendTransport.on("produce", async ({ kind, rtpParameters }, callback, errback) => {
            try {
                await new Promise(resolve => {
                    SocketClient.serverActionListener.listenOnce("SFU_CONFIRM_PRODUCE", data => {
                        if (data.kind === kind) {
                            callback({ producerId: data.producerId })
                            resolve()
                        }
                    })

                    console.log("Requesting Producer")
                    SocketClient.sendToServer("SFU_REQUEST_PRODUCE", {
                        kind: kind,
                        rtpParameters: rtpParameters,
                        routerId: this.connectedRouterId
                    })
                })
            } catch (e) { errback(e) }
        })

        if (!this.sendTransport) return

        for (const track of this.localStream.getTracks()) {
            const producer = await this.sendTransport.produce({ track })
            this.producers[track.kind] = producer
        }

        SocketClient.sendToServer("SFU_GET_EXISTING_PRODUCERS", {
            routerId: this.connectedRouterId
        })
    }

    static async setupRecvTransport(params) {
        this.recvTransport = this.device.createRecvTransport(params)

        this.recvTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
            try {
                console.log("Requesting Connection For Webrtc Recv Transport")

                SocketClient.sendToServer("SFU_CONNECT_TRANSPORT", {
                    direction: "recv",
                    dtlsParameters: dtlsParameters,
                    routerId: this.connectedRouterId
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

        SocketClient.sendToServer("SFU_REQUEST_CONSUME", {
            producerId: producerId,
            rtpCapabilities: this.device.rtpCapabilities,
            routerId: this.connectedRouterId
        })

        SocketClient.serverActionListener.listenOnce("SFU_CONFIRM_CONSUME", async data => {
            if (data.consumerParams.producerId !== producerId) return

            const consumer = await this.recvTransport.consume(data.consumerParams)
            
            if (!this.consumers[data.clientId]) {
                this.consumers[data.clientId] = { stream: new MediaStream() }
                Dom.add([ HtmlVideo.guest(this.consumers[data.clientId].stream) ])
            }

            this.consumers[data.clientId].stream.addTrack(consumer.track)
        })
    }

    static async create() {
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        Dom.add([ HtmlVideo.local(this.localStream) ])

        SocketClient.sendToServer("SFU_CREATE_ROUTER", {})
    }

    static async connect(routerId) {
        SocketClient.sendToServer("SFU_CONNECT_ROUTER", {
            routerId: routerId
        })
    }

    static disconnect() {
        SocketClient.sendToServer("SFU_DISCONNECT_ROUTER", {
            routerId: routerId
        })
    }
}