const LowLevelSocketServer = require('./LowLevelSocketServer')
const List = require('./List')

module.exports = class {
	constructor(port) {
		this.allClients = []
		this.allClientIds = []

		this.clientFrom = {}
		this.clientIdFrom = {}

		this.socket = new LowLevelSocketServer(port)

		this.socket.onConnection = (client, clientId) => {
			this.allClients.push(client)
			this.allClientIds.push(clientId)
			console.log(this.allClientIds)

			this.clientFrom[clientId] = client
			this.clientIdFrom[client] = clientId

			this.sendToEveryone({
				action: "UPDATE_CLIENTS_LIST",
				clientIds: this.allClientIds
			})
		}

		this.socket.onClose = (client, clientId) => {
			List.remove(this.allClients, client)
			List.remove(this.allClientIds, clientId)
			console.log(this.allClientIds)

			delete this.clientFrom[clientId]
			delete this.clientIdFrom[client]

			this.sendToEveryone({
				action: "REMOVE_CLIENT",
				clientId: clientId
			})
		}

		this.socket.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
			console.log(`Server Passing Message: ${JSON.stringify(data)}`)

			this.index = this.socket.allClientIds.indexOf(data.targetClientId)
			this.targetClient = this.socket.allClients[this.index]
		
			this.socket.sendToClient(this.targetClient, data);
		})
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
		this.socket.on(action, callback)
	}

	start() {
		this.socket.start()
	}
}