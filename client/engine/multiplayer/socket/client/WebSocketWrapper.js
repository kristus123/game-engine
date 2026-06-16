export class WebSocketWrapper {

	static wasConnected = false

	static {
		this.webSocket = new WebSocket(`${Config.wsUrl}?clientId=${My.clientId}`)

		this.webSocket.onopen = () => {
			this.wasConnected = true
			this.onOpen()
		}

		this.webSocket.onmessage = e => {
			this.onMessage(JSON.parse(e.data))
		}

		this.webSocket.onclose = () => {
			this.onClose()
		}

		this.webSocket.onerror = () => {
			this.onError()
		}
	}

	static send(data) {
		if (this.webSocket.readyState == WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
		}
	}

	static onOpen() {}
	static onMessage(data) {
	}

	static onClose() {
		if (this.wasConnected) {
			throw new Error("Socket connection lost")
		}
	}
	static onError() {
		if (!this.wasConnected) {
			throw new Error("Failed to connect to socket server")
		}
	}
}
