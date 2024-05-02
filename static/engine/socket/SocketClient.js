export class SocketClient {
	constructor(run) {
		this.listeners = {}

		this.webSocket = new WebSocket('ws://localhost:8080')

		this.webSocket.onopen = () => {
		}

		run(this)

		this.webSocket.onmessage = e => {
			const data = JSON.parse(e.data)

			if (this.listeners[data.action]) {
				this.listeners[data.action](data)
			}
			else {
				console.log(data.action + " not found")
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

