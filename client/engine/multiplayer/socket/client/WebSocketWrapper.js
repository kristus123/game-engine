// ClientId( // hack

export class WebSocketWrapper {
	static {
		this.webSocket = new WebSocket(`${Config.wsUrl}?clientId=${ClientId}`)

		this.webSocket.onopen = () => {
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
		if (this.webSocket.readyState === WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
		}
	}

	static onOpen() {}
	static onMessage(data) {}
	static onClose() {}
	static onError() {
		console.error('Fail to Connect')
	}
}
