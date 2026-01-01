// ClientId( // hack

export class WebSocketWrapper {
	constructor(run) {
		this.webSocket = new WebSocket(`ws://localhost:8082?clientId=${ClientId}`)

		this.webSocket.onopen = () => {
			this.onOpen()
		}

		run(this)

		this.webSocket.onmessage = e => {
			const data = JSON.parse(e.data)
			this.onMessage(data)
		}

		this.webSocket.onclose = () => {
			this.onClose()
		}
	}

	send(data) {
		if (this.webSocket.readyState === WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
		}
	}

	onOpen() {}
	onMessage() {}
	onClose() {}
}
