// ClientId( // hack

export class WebSocketWrapper {
	static {
		this.webSocket = new WebSocket(`ws://${Config.baseUrl}?clientId=${ClientId}`)

		this.webSocket.onopen = () => {
			this.onOpen()
		}

		this.webSocket.onmessage = e => {
			this.onMessage(JSON.parse(e.data))
		}

		this.webSocket.onclose = () => {
			this.onClose()
		}
	}

	static send(data) {
		if (this.webSocket.readyState === WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
		}
	}

	static onOpen() {}
	static onMessage(data) {}
	static onClose() {}
}
