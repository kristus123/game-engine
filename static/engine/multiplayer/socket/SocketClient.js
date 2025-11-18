const clientId = Random.uuid()

export class SocketClient {
	constructor(port, run) {
		this.listeners = {}

		// List of all connected clients
		this.connectedClients = {}

		this.clientId = clientId
		this.webSocket = new WebSocket(`ws://localhost:${port}?clientId=${this.clientId}`)

		this.webSocket.onopen = () => {}

		run(this)

		this.webSocket.onmessage = e => {
			const data = JSON.parse(e.data)

			// Test Code
			this.appendClient(data.clientId)
			console.log(data)
			console.log(this.connectedClients)

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

	appendClient(clientId){
		if (this.connectedClients[clientId] != null)
		{
			return;
		}

		this.connectedClients[clientId] = {
			clientStatus: true,
		}
	}

	removeClient(clientId){
		if (this.connectedClients[clientId] === null)
		{
			return;
		}
		this.connectedClients[clientId].clientStatus = false
	}

	getClientList(){
		return this.connectedClients
	}

	close() {}

	on(event, callback) {
		this.listeners[event] = callback
	}
}
