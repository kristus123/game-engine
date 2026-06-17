export class WebSocketWrapper {

	static {
		this.webSocket = new WebSocket(`${Config.wsUrl}?clientId=${My.clientId}`)

		this.webSocket.onopen = () => {
			console.log("WebSocket connection opened")
		}

		this.webSocket.onmessage = e => {
			this.onMessage(JSON.parse(e.data))
		}

		this.webSocket.onclose = () => {
			throw new Error("Socket connection lost")
		}

		this.webSocket.onerror = () => {
			throw new Error("Failed to connect to socket server")
		}
	}

	static send(data) {
		if (this.webSocket.readyState == WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
		}
	}

	static onMessage(data) {} // this method is supposed to be overridden
}
