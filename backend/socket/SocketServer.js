import { WebSocketServer } from "ws"

export class SocketServer {

	static {
		this.actions = {}

		this.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
			console.log(`Server Passing Message: ${JSON.stringify(data)}`)

			const targetClient = SocketClients.fromId(data.targetClientId)

			this.sendToClient(targetClient, data)
		})
	}

	static start(server) {
		new WebSocketServer({ server: server }).on("connection", (client, request) => {
			const urlParameters = new URLSearchParams(request.url.split("?")[1])
			const clientId = urlParameters.get("clientId") // I think backend should be the one that creates the client ID

			SocketClients.add(client, clientId)

			console.log("triggered onConnection")
			console.log(`${clientId} has connected`)

			this.sendToEveryone({
				action: "UPDATE_CLIENTS_LIST",
				clientIds: SocketClients.ids,
				originClientId: clientId,
			})

			client.on("message", data => {
				data = JSON.parse(data)

				if (this.actions[data.action]) {
					this.actions[data.action](client, clientId, data)
				}
				else {
					throw new Error(data.action + " does not exist")
				}
			})

			client.on("close", () => {
				SocketClients.remove(client)

				console.log(`${clientId} has disconnected`)

				SfuServer.closeConnectionWithClient(clientId)

				this.sendToEveryone({
					action: "REMOVE_CLIENT",
					clientId: clientId,
				})
			})
		})
	}

	static on(action, callback) {
		if (this.actions[action]) {
			throw new Error("can't add duplicate action: " + action)
		}
		else {
			this.actions[action] = callback
		}
	}

	static sendToOthers(origin, data) {
		for (const client of SocketClients.all) {
			if (client != origin) {
				client.send(JSON.stringify(data))
			}
		}
	}

	static sendToEveryone(data) {
		for (const client of SocketClients.all) {
			client.send(JSON.stringify(data))
		}
	}

	static sendToClient(client, data) {
		client.send(JSON.stringify(data))
	}

}
