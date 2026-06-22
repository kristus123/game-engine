import { List } from '#root/transpiledBackend/server/socket/List.js'; 
import { LowLevelSocketServer } from '#root/transpiledBackend/server/socket/LowLevelSocketServer.js'; 

export class SimplifiedSocketServerAPI {
	constructor() {
super()

		this.allClients = []
		this.allClientIds = []

		this.clientFrom = {}
		this.clientIdFrom = {}

		this.lowLevelSocketServer = new LowLevelSocketServer({
			onConnection: (client, clientId) => {
				this.allClients.push(client)
				this.allClientIds.push(clientId)

				this.clientFrom[clientId] = client
				this.clientIdFrom[client] = clientId

				this.onConnection(client, clientId)
				console.log("triggered onConnection")
			},
			onClose: (client, clientId) => {
				List.remove(this.allClients, client)
				List.remove(this.allClientIds, clientId)

				delete this.clientFrom[clientId]
				delete this.clientIdFrom[client]

				this.onClose(client, clientId)
			}
		})
	}

	sendToOthers(origin, data) {
			Assert.notNull(origin, 'param 1 - origin - SimplifiedSocketServerAPI.sendToOthers')
			Assert.notNull(data, 'param 2 - data - SimplifiedSocketServerAPI.sendToOthers')
		for (const client of this.allClients) {
			if (client != origin) {
				client.send(JSON.stringify(data))
			}
		}
	}

	sendToEveryone(data) { // todo maybe pass client first just to keep it consistent
			Assert.notNull(data, 'param 1 - data - SimplifiedSocketServerAPI.sendToEveryone')
		for (const client of this.allClients) {
			client.send(JSON.stringify(data))
		}
	}

	sendToClient(client, data) {
			Assert.notNull(client, 'param 1 - client - SimplifiedSocketServerAPI.sendToClient')
			Assert.notNull(data, 'param 2 - data - SimplifiedSocketServerAPI.sendToClient')
		client.send(JSON.stringify(data))
	}

	on(action, callback) {
			Assert.notNull(action, 'param 1 - action - SimplifiedSocketServerAPI.on')
			Assert.notNull(callback, 'param 2 - callback - SimplifiedSocketServerAPI.on')
		this.lowLevelSocketServer.on(action, callback)
	}

	start(server) {
			Assert.notNull(server, 'param 1 - server - SimplifiedSocketServerAPI.start')
		this.lowLevelSocketServer.start(server)
	}
}

