// WebSocket.CONNECTING // 0
// WebSocket.OPEN       // 1
// WebSocket.CLOSING    // 2
// WebSocket.CLOSED     // 3

export class SocketClient {

	static {
		this.webSocket = null
		this._connectionPromise = null

		this.clientActionListener = ActionListener()
		this.serverActionListener = ActionListener()

		this.onRemovedClient = (clientId) => {}

		this.serverActionListener.listen("UPDATE_CLIENTS_LIST", ({ data }) => {
			const clientIds = data.clientIds.filter(clientId => clientId != My.clientId) // todo find fix for this
			const diffs = OtherClients.ids.unorderedDiff(clientIds)

			for (const d of diffs) {
				if (d.add) {
					OtherClients.add(d.value)
				}
				else if (d.remove) {
					OtherClients.remove(d.value)
					this.onRemovedClient(d.value)
				}
			}
		})

		this.serverActionListener.listen("CLIENT_TO_CLIENT", ({ data, metaHeaders }) => {
			this.clientActionListener.trigger(metaHeaders.subAction, { data: data, metaHeaders: metaHeaders })
		})

		this.serverActionListener.listen("CLIENT_ID", ({ metaHeaders }) => {
			console.log(metaHeaders.targetClientId)
		})

		setInterval(() => {
			if (ChaosMonkey.maybe("socket connection closed", 0.2)) {
				this.webSocket?.close()
			}
		}, 5_00)
	}

	static async connect() {
		const socket = this.webSocket
		const state = socket?.readyState

		if (state == WebSocket.OPEN) {
			return
		}

		if (state == WebSocket.CONNECTING) {
			return this._connectionPromise
		}

		if (state == WebSocket.CLOSING) {
			return new Promise(resolve => {
				socket.addEventListener("close", () => resolve(this.connect()), { once: true })
			})
		}

		const connectionPromise = new Promise((resolve, reject) => {
			ChaosMonkey.maybeCrash("failed to connect to socket")
			const nextSocket = new WebSocket(`${Config.wsUrl}?clientId=${My.clientId}`)
			this.webSocket = nextSocket

			nextSocket.onopen = () => {
				console.log("WebSocket connection opened")
				this._connectionPromise = null

				if (!this._firstConnect) {
					this.onFirstConnect?.()
					this._firstConnect = true
				}

				this.onEveryConnect?.()

				this.sendToServer("HOT_RELOAD_BACKEND_ID", {})

				resolve()
			}

			nextSocket.onerror = () => {
				reject(new Error("Failed to connect to socket server"))
			}

			nextSocket.onclose = () => {
				if (this.webSocket != nextSocket) {
					return
				}

				this._connectionPromise = null
				setTimeout(async () => {
					try {
						await this.connect()
					}
					catch (error) {
						console.error(error)
					}
				}, 1000)

				console.error("Socket connection lost")
			}

			nextSocket.onmessage = e => {
				const message = JSON.parse(e.data)

				this.serverActionListener.trigger(message.metaHeaders.action, {
					data: message.data,
					metaHeaders: message.metaHeaders,
				})
			}

		})
		this._connectionPromise = connectionPromise
		connectionPromise.catch(() => {
			if (this.webSocket?.readyState != WebSocket.CONNECTING) {
				this._connectionPromise = null
			}
		})
		return connectionPromise
	}

	static async connectIfNotConnected() {
		return this.connect()
	}

	static sendToServer(action, data={}, additionalMetaHeaders = {}) {

		Assert.true(this.connected, "Not allowed to call .send() if socket connection not open.")

		Retry(3, () => {
			ChaosMonkey.maybeCrash("socket failed to send message")
			this.webSocket.send(JSON.stringify({
				data: data,
				metaHeaders: {
					...additionalMetaHeaders,
					action: action,
					originClientId: My.clientId,
				},
			}))
		})
	}

	static sendToClient(subAction, targetClientIds, data) {
		const clientIds = Array.isArray(targetClientIds) ? targetClientIds : [targetClientIds]

		if (clientIds.empty) {
			return
		}

		const targetHeaders = Array.isArray(targetClientIds)
			? { targetClientIds: clientIds }
			: { targetClientId: targetClientIds }

		this.sendToServer("CLIENT_TO_CLIENT", data, {
			...targetHeaders,
			subAction: subAction,
		})
	}

	static sendToOtherClients(subAction, data) {
		this.sendToClient(subAction, [...OtherClients.ids], data)
	}

	static sendToAllClients(subAction, data) {
		this.sendToClient(subAction, [...OtherClients.ids, My.clientId], data)
	}

	static onServerMessage(action, callback) {
		this.serverActionListener.listen(action, callback)
	}

	static onClientMessage(action, callback) {
		this.clientActionListener.listen(action, callback)
	}

	static get connected() {
		return this.webSocket?.readyState == WebSocket.OPEN
	}
}
