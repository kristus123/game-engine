import { WebSocketServer } from "ws"

export class SocketServer {

	static {
		this.actions = {}

		this.on("CLIENT_TO_CLIENT", ({ clientId, data, metaHeaders }) => {
			this.sendToClient(SocketClients.fromId(metaHeaders.targetClientId), {
				action: "CLIENT_TO_CLIENT",
				originClientId: clientId,
				subAction: metaHeaders.subAction,
			}, data)
		})
	}

	static start(server, { onJoin, onLeave } = {}) { // no-null-check // todo add async await for this one
		new WebSocketServer({ server: server }).on("connection", (client, request) => {
			const urlParameters = new URLSearchParams(request.url.split("?")[1])
			const clientId = urlParameters.get("clientId") // I think backend should be the one that creates the client ID

			SocketClients.add(client, clientId)
			onJoin?.({ client: client, clientId: clientId })

			this.sendToClient(client, { action: "CLIENT_ID" }, {
				clientId: clientId,
			})

			console.log(`${clientId} has connected`)

			this.sendToEveryone({
				action: "UPDATE_CLIENTS_LIST",
				originClientId: clientId,
			}, {
				clientIds: SocketClients.ids, // use x.diff(y) on frontend
			})

			client.on("message", data => {
				const message = JSON.parse(data)
				const metaHeaders = message.metaHeaders
				const body = message.data

				// The server is authoritative about which connected client sent the message.
				metaHeaders.originClientId = clientId

				if (this.actions[metaHeaders.action] != null) {
					this.actions[metaHeaders.action]({
						client: client,
						clientId: clientId,
						data: body,
						metaHeaders: metaHeaders,
					})
				}
				else {
					throw new Error(metaHeaders.action + " does not exist")
				}
			})

			client.on("close", () => {
				SocketClients.remove(client)
				onLeave?.({ clientId: clientId })

				console.log(`${clientId} has disconnected`)

				SfuServer.closeConnectionWithClient(clientId)

				this.sendToEveryone({
					action: "REMOVE_CLIENT", // send entire list instead and use x.diff(y)
				}, {
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

	static sendToOthers(origin, metaHeaders, data = {}) {
		for (const client of SocketClients.all) {
			if (client != origin) {
				client.send(JSON.stringify({ metaHeaders: metaHeaders, data: data }))
			}
		}
	}

	static sendToEveryone(metaHeaders, data = {}) {
		for (const client of SocketClients.all) {
			client.send(JSON.stringify({ metaHeaders: metaHeaders, data: data }))
		}
	}

	static sendToClient(client, metaHeaders, data = {}) {
		client.send(JSON.stringify({ metaHeaders: metaHeaders, data: data }))
	}

}
