const LowLevelSocketServer = require('./LowLevelSocketServer')
const List = require('./List')

module.exports = class {
	constructor(port) {

		this.allClients = []
		this.allClientIds = []

		this.clientFrom = {}
		this.clientIdFrom = {}

		this.lowLevelSocketServer = new LowLevelSocketServer(port)

		this.lowLevelSocketServer.onConnection = function(client, clientId) {
			this.allClients.push(client)
			this.allClientIds.push(clientId)

			this.clientFrom[clientId] = client
			this.clientIdFrom[client] = clientId

			this.onConnection(client, clientId)
		}

		this.lowLevelSocketServer.onClose = function onClose(client) {
			const clientUuid = this.clientIdFrom[client]

			List.remove(this.allClients, client)
			List.remove(this.allClientIds, clientUuid)

			delete this.clientFrom[clientUuid]
			delete this.clientIdFrom[client]

			this.onClose(client)
		}
	}

	sendToOthers(from, data) {
		for (const client of this.allClients) {
			if (client !== from) {
				client.send(JSON.stringify(data))
			}
		}
	}

	sendToEveryone(data) {
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
