const LowLevelSocketServer = require('./LowLevelSocketServer')
const List = require('./List')

module.exports = class {
	constructor(port) {

		this.allClients = []
		this.allClientIds = []

		this.clientFrom = {}
		this.clientIdFrom = {}

		this.lowLevelSocketServer = new LowLevelSocketServer(port)

		this.lowLevelSocketServer.onConnection = (client, clientId) => {
			this.allClients.push(client)
			this.allClientIds.push(clientId)
			console.log(this.allClientIds)

			this.clientFrom[clientId] = client
			this.clientIdFrom[client] = clientId

			this.onConnection(client, clientId)
		}

		this.lowLevelSocketServer.onClose = (client, clientId) => {
			List.remove(this.allClients, client)
			List.remove(this.allClientIds, clientId)
			console.log(this.allClientIds)

			delete this.clientFrom[clientId]
			delete this.clientIdFrom[client]

			this.onClose(client, clientId)
		}
	}

	sendToOthers(from, data) {
		for (const client of this.allClients) {
			if (client !== from) {
				client.send(JSON.stringify(data))
			}
		}
	}

	sendToEveryone(data) { // todo maybe pass client first just to keep it consistent
		for (const client of this.allClients) {
			client.send(JSON.stringify(data))
		}
	}

	sendToClient(client, data) {
		client.send(JSON.stringify(data))
	}

	on(action, callback) {
		this.lowLevelSocketServer.on(action, callback)
	}

	start() {
		this.lowLevelSocketServer.start()
	}
}
