let clientId
let ports
let portget = true
export class SocketClient {
	constructor(port, run) {
		this.listeners = {}
		if (ports == undefined) {
			ports = port
		}
		if (ports == port) {
			clientId = Random.uuid().toString()

		}
		this.clientId = clientId
		this.webSocket = new WebSocket(`ws://localhost:${port}?clientId=${this.clientId}`)

		this.webSocket.onopen = () => {
		}

		run(this)

		this.webSocket.onmessage = e => {
			const data = JSON.parse(e.data)

			if (this.listeners[data.action]) {
				this.listeners[data.action](data)
			}
			else {
				console.log(data.action + ' not found')
			}
		}

		this.webSocket.onclose = () => {
			this.close()
		}
	}

	send(data) {
		if (this.webSocket.readyState === WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
			console.log(JSON.stringify(data))
		}
	}

	close() {}

	on(event, callback) {
		this.listeners[event] = callback
	}
}

