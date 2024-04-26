export class SocketClient {

	constructor() {
		this.ws = new WebSocket('ws://localhost:8080')

		this.ws.onopen = () => {
			this.send({
				action: 'NEW_PLAYER',
				playerId: Uuid.create()
			})
		}

		this.ws.onmessage = e => {
			const data = JSON.parse(e.data)
			this.message(data)
		}

		this.ws.onclose = () => {
			this.close()
		}
	}

	send(data) {
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(data))
		}
	}

	message() {

	}

	close() {

	}

}
