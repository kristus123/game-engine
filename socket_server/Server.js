const WebSocket = require('ws')

let i = 0
function uuid() {
	return i += 1
}

module.exports = class Server {
	constructor() {
		this.clientsAndPlayerIds = []
		this.actions = {}
	}

	sendToOthers(client, data) {
		this.clientsAndPlayerIds
			.filter(c => c.client !== client) // Exclude the client that initiated the action
			.forEach(c => {
				c.client.send(JSON.stringify(data))
			})
	}

	sendToEveryone(data) {
		this.clientsAndPlayerIds.forEach(c => {
			c.client.send(JSON.stringify(data))
		})
	}

	sendToClient(client, data) {
		client.send(JSON.stringify(data))
	}

	start() {
		new WebSocket.Server({ port: 8080 }).on('connection', client => {

			this.onConnection(client)

			client.on('message', data => {
				data = JSON.parse(data)

				if (this.actions[data.action]) {
					this.actions[data.action](client, data)
				}
			})

			client.on('close', () => {
				this.onClose(client)
			})
		})
	}

	on(action, callback) {
		this.actions[action] = callback
	}
}
