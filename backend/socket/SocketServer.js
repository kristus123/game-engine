import { WebSocketServer } from "ws"

export class SocketServer {

	static {
		this.actions = {}

		this.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
			this.sendToClient(SocketClients.fromId(data.targetClientId), data)
		})
	}

	static start(server, {onJoin, onLeave} = {}) { // todo add async await for this one
		new WebSocketServer({ server: server }).on("connection", (client, request) => {
			const urlParameters = new URLSearchParams(request.url.split("?")[1])
			const clientId = urlParameters.get("clientId") // I think backend should be the one that creates the client ID

			SocketClients.add(client, clientId)
			onJoin?.(clientId)

			this.sendToClient(client, {
				action: "CLIENT_ID",
				clientId: clientId,
			})

			console.log(`${clientId} has connected`)

			this.sendToEveryone({
				action: "UPDATE_CLIENTS_LIST",
				clientIds: SocketClients.ids, // use x.diff(y) on frontend
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
				onLeave?.(clientId)

				console.log(`${clientId} has disconnected`)

				SfuServer.closeConnectionWithClient(clientId)

				this.sendToEveryone({
					action: "REMOVE_CLIENT", // send entire list instead and use x.diff(y)
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
