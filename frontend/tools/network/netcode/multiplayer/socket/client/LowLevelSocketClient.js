export class LowLevelSocketClient {

	static {
		this.webSocket = new WebSocket(`${Config.wsUrl}?clientId=${My.clientId}`)

		this.webSocket.onopen = () => {
			console.log("WebSocket connection opened")
		}

		this.webSocket.onclose = () => {
			throw new Error("Socket connection lost")
		}

		this.webSocket.onerror = () => {
			throw new Error("Failed to connect to socket server")
		}

		this.webSocket.onmessage = e => {
			this.onMessage(JSON.parse(e.data))
		}
	}

	static send(data) {
		if (this.webSocket?.readyState == WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
		}
		else {
			throw new Error("Not allowed to call .send() if socket connection not open.")
		}
	}

	static onMessage(data) { // this method is supposed to be overridden
	}

}


// WebSocket.CONNECTING // 0
// WebSocket.OPEN       // 1
// WebSocket.CLOSING    // 2
// WebSocket.CLOSED     // 3
