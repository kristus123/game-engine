const clientId = Random.uuid()

export class SocketClient {
	constructor(port, run) {
		this.listeners = {}

		// List of all connected clients
		this.connectedClientIds = []

		this.clientId = clientId
		this.webSocket = new WebSocket(`ws://localhost:${port}?clientId=${this.clientId}`)

		this.webSocket.onopen = () => {}

		run(this)

		this.webSocket.onmessage = e => {
			const data = JSON.parse(e.data)
			console.log(data)

			if (data.action === 'UPDATE_CLIENTS_LIST') {
				for (const clientId of data.clientIds) {
					if (!this.connectedClientIds.includes(clientId)) {
						this.connectedClientIds.push(clientId)
					}
				}
				console.log(this.connectedClientIds)
			}
			if (data.action === 'REMOVE_CLIENT') {
				const index = this.connectedClientIds.indexOf(data.clientId)
				this.connectedClientIds.splice(index, 1)
				console.log(this.connectedClientIds)
			}

			if (this.listeners[data.action]) {
				try {
					this.listeners[data.action](data)
				}
				catch (error) {
					console.log('An error occurred when doing ' + data.action)
					console.log(error)
					throw error
				}
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
		}
	}

	close() {}

	on(event, callback) {
		this.listeners[event] = callback
	}
}
