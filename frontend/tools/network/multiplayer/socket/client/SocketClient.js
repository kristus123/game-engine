export class SocketClient {

	static {
		this.webSocket = null

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
	}

	static connect() {
		if (this._connectCalled) {
			throw new Error("you are only allowed to call .connect once (unless internal programatic reconnect)")
		}
		else {
			this._connectCalled = true
		}

		// WebSocket.CONNECTING // 0
		// WebSocket.OPEN       // 1
		// WebSocket.CLOSING    // 2
		// WebSocket.CLOSED     // 3

		this.webSocket = new WebSocket(`${Config.wsUrl}?clientId=${My.clientId}`)

		this.webSocket.onopen = () => {
			console.log("WebSocket connection opened")

			if (this._firstConnect) {
				// already triggered onFirstConnect
			}
			else {
				this.onFirstConnect?.()
				this._firstConnect = true
			}

			this.onEveryConnect?.()

			this.sendToServer("HOT_RELOAD_BACKEND_ID", {})
		}

		this.webSocket.onclose = () => {
			setTimeout(() => {
				this._connectCalled = false
				this.connect()
			}, 1000)
			throw new Error("Socket connection lost")
		}

		this.webSocket.onerror = () => {
			throw new Error("Failed to connect to socket server")
		}

		this.webSocket.onmessage = e => {
			const message = JSON.parse(e.data)
			this.serverActionListener.trigger(message.metaHeaders.action, {
				data: message.data,
				metaHeaders: message.metaHeaders,
			})
		}
	}

	static sendToServer(action, data, additionalMetaHeaders = {}) {
		if (this.webSocket?.readyState == WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify({
				data: data,
				metaHeaders: {
					...additionalMetaHeaders,
					action: action,
					originClientId: My.clientId,
				},
			}))
		}
		else {
			throw new Error("Not allowed to call .send() if socket connection not open.")
		}
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
}
