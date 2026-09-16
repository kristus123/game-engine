import { WebSocketServer } from "ws"

export class SocketServer {

	static {
		this.allClients = []
		this.allClientIds = []

		this.clientFrom = {}
		this.clientIdFrom = {}

		this.actions = {}

		this.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
			console.log(`Server Passing Message: ${JSON.stringify(data)}`)

			const index = SocketServer.allClientIds.indexOf(data.targetClientId)
			const targetClient = SocketServer.allClients[index]

			SocketServer.sendToClient(targetClient, data)
		})
	}

	static start(server) {
		new WebSocketServer({ server: server }).on("connection", (client, request) => {

			const urlParameters = new URLSearchParams(request.url.split("?")[1])
			const clientId = urlParameters.get("clientId")

			this.allClients.push(client)
			this.allClientIds.push(clientId)

			this.clientFrom[clientId] = client
			this.clientIdFrom[client] = clientId

			console.log("triggered onConnection")
			console.log(`${clientId} has connected`)

			this.sendToEveryone({ // in future we can use {}.diff(data) instead
				action: "UPDATE_CLIENTS_LIST",
				clientIds: this.allClientIds,
				originClientId: clientId,
			})

			client.on("message", data => {
				data = JSON.parse(data)

				if (this.actions[data.action]) {
					this.actions[data.action](client, clientId, data) // todo turn args into {...}={} since usually you don't need all values
				}
			})

			client.on("close", () => {
				List.remove(this.allClients, client)
				List.remove(this.allClientIds, clientId)

				delete this.clientFrom[clientId]
				delete this.clientIdFrom[client]

				console.log(`${clientId} has disconnected`)

				SfuServer.closeConnectionWithClient(clientId)

				this.sendToEveryone({ // in future we can use {}.diff(data) instead
					action: "REMOVE_CLIENT",
					clientId: clientId,
				})
			})
		})
	}

	static on(action, callback) {
		this.actions[action] = callback
	}

	static sendToOthers(origin, data) {
		for (const client of this.allClients) {
			if (client != origin) {
				client.send(JSON.stringify(data))
			}
		}
	}

	static sendToEveryone(data) {
		for (const client of this.allClients) {
			client.send(JSON.stringify(data))
		}
	}

	static sendToClient(client, data) {
		client.send(JSON.stringify(data))
	}

}
