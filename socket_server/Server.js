const WebSocket = require('ws')

module.exports = class {
	constructor(port) {
		this.port = port

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

	getPlayerId(client) {
		return this.clientsAndPlayerIds
			.filter(c => c.client === client)
			.map(c => c.playerId.toString())
	}

	remove(client) {
		for (let i = this.clientsAndPlayerIds.length - 1; i >= 0; i--) {
			if (this.clientsAndPlayerIds[i].client === client) {
				this.clientsAndPlayerIds.splice(i, 1)
			}
		}
	}

	start() {
		new WebSocket.Server({ port: this.port }).on('connection', client => {

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
