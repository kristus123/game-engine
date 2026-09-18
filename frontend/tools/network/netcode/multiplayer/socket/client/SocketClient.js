export class SocketClient {

	static {
		this.webSocket = null

		this.clientActionListener = ActionListener()
		this.serverActionListener = ActionListener()

		this.onRemovedClient = (clientId) => {}

		this.serverActionListener.listen("UPDATE_CLIENTS_LIST", data => {
			for (const clientId of data.clientIds) {
				OtherClients.add(clientId)
			}
		})

		this.serverActionListener.listen("REMOVE_CLIENT", data => {
			OtherClients.remove(data.clientId)

			this.onRemovedClient(data.clientId)
		})

		this.serverActionListener.listen("CLIENT_TO_CLIENT", data => {
			this.clientActionListener.trigger(data.subAction, data)
		})

		this.serverActionListener.listen("CLIENT_ID", data => {
			console.log(data)
		})
	}

	static connect(onConnect) {
		// WebSocket.CONNECTING // 0
		// WebSocket.OPEN       // 1
		// WebSocket.CLOSING    // 2
		// WebSocket.CLOSED     // 3

		this.webSocket = new WebSocket(`${Config.wsUrl}?clientId=${My.clientId}`)

		this.webSocket.onopen = () => {
			//Todo: this should not be triggered on every onOpen
			// We should have one connect and one on initial connect
			onConnect()
			console.log("WebSocket connection opened")
		}

		this.webSocket.onclose = () => {
			setTimeout(() => {
				this.connect(onConnect)
			}, 1000)
			throw new Error("Socket connection lost")
		}

		this.webSocket.onerror = () => {
			throw new Error("Failed to connect to socket server")
		}

		this.webSocket.onmessage = e => {
			const data = JSON.parse(e.data)
			this.serverActionListener.trigger(data.action, data)
		}
	}

	static sendToServer(action, data) {
		if (this.webSocket?.readyState == WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data.merge({
				action: action,
				originClientId: My.clientId
			})))
		}
		else {
			throw new Error("Not allowed to call .send() if socket connection not open.")
		}
	}

	static sendToClient(subAction, targetClientIds, data) {
		for (const id of Always.list(targetClientIds)) {
			this.sendToServer("CLIENT_TO_CLIENT", data.merge({
				subAction: subAction,
				targetClientId: id,
			}))
		}
	}

	static sendToOtherClients(subAction, data) {
		for (const targetClientId of OtherClients.ids) {
			SocketClient.sendToClient(subAction, targetClientId, data)
		}
	}

	static sendToAllClients(subAction, data) {
		this.sendToOtherClients(subAction, data)
		this.sendToClient(subAction, My.clientId, data)
	}

	static onServerMessage(action, callback) {
		this.serverActionListener.listen(action, callback)
	}

	static onClientMessage(action, callback) {
		this.clientActionListener.listen(action, callback)
	}
}

