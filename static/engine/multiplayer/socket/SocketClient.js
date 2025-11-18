const clientId = Random.uuid()

export class SocketClient {
	constructor(port, run) {
		this.listeners = {}

		// List of all connected clients
		this.connectedClients = {}

		this.clientId = clientId
		this.webSocket = new WebSocket(`ws://localhost:${port}?clientId=${this.clientId}`)

		this.webSocket.onopen = () => {
			this.send({action: "NEW_CONNECTION", clientId: this.clientId})
		}

		run(this)

		this.webSocket.onmessage = e => {
			const data = JSON.parse(e.data)

			if (data.action === "NEW_CONNECTION")
			{
				this.appendClient(data.clientId)
				this.sendSyncReq()
			}
			if (data.action === "SYNC_CLIENTS")
			{
				const clients = JSON.parse(data.data)
				this.connectedClients.concat(clients)
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

	appendClient(clientId){
		if (this.connectedClients[clientId] === null)
		{
			this.connectedClients[clientId] = {}
		}
		else
		{
			throw "SocketClient: Can't Append Client. Client Is Already Present!"
		}
	}

	removeClient(clientId){
		if (this.connectedClients[clientId] != null)
		{
			delete this.connectedClients[clientId]
		}
		else
		{
			throw "SocketClient: Can't Remove Client. Client Is Not Present!"
		}
	}
	sendSyncReq()
	{
		send({
			action: "SYNC_CLIENTS",
			data: JSON.stringify(this.connectedClients)
		})
	}
	close()
	{
		this.removeClient(clientId)
		this.sendSyncReq()
	}

	on(event, callback) {
		this.listeners[event] = callback
	}
}
