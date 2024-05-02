export class SocketClient {

	constructor() {
		this.listeners = {}
	}

	connect() {
		this.webSocket = new WebSocket('ws://localhost:8080')

		this.webSocket.onopen = () => {
			this.send({
				action: 'NEW_PLAYER',
				playerId: Uuid.create()
			})
		}

		this.webSocket.onmessage = e => {
			const data = JSON.parse(e.data)

			if (this.listeners[data.action]) {
				this.listeners[data.action](data)
			}
		}

		this.webSocket.onclose = () => {
			this.close()
		}
		
	}

	send(data) {
		if (this.webSocket.readyState === WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
		}
	}

	close() {}

	on(event, callback) {
		this.listeners[event] = callback
	}
}

