import { WebSocket, WebSocketServer } from "ws"

export class SocketServer {

	static {
		this.actions = {}
		this.server = null

		this.on("CLIENT_TO_CLIENT", ({ clientId, data, metaHeaders }) => {

			const targetClientIds = Always.list(Assert.onlyOneValue(
				metaHeaders.targetClientIds, metaHeaders.targetClientId,
			)).assertValues()

			for (const targetClientId of targetClientIds) {
				const target = SocketClients.fromId(targetClientId)
				if (target) {
					this.sendToClient(target, {
						data: data,
						metaHeaders: {
							action: "CLIENT_TO_CLIENT",
							subAction: metaHeaders.subAction,
							originClientId: clientId,
							targetClientId: targetClientId,
							// targetClientIds: targetClientIds, // maybe we want this, or mby not.
						},
					})
				}
			}
		})
	}

	static start(server, { onJoin, onLeave } = {}) { // no-null-check // todo add async await for this one
		this.server = new WebSocketServer({ server: server })
		this.server.on("connection", (client, request) => {
			const urlParameters = new URLSearchParams(request.url.split("?")[1])
			const clientId = urlParameters.get("clientId") // I think backend should be the one that creates the client ID. fix later, not now

			SocketClients.add(client, clientId)
			onJoin?.({ client: client, clientId: clientId })

			this.sendToClient(client, {
				data: {},
				metaHeaders: {
					action: "CLIENT_ID",
					originClientId: clientId,
				},
			})

			console.log(`${clientId} has connected`)

			this.sendToEveryone({
				data: {
					clientIds: SocketClients.ids,
				},
				metaHeaders: {
					action: "UPDATE_CLIENTS_LIST",
					originClientId: clientId,
				},
			})

			client.on("message", m => {
				const message = JSON.parse(m)
				const metaHeaders = message.metaHeaders

				if (this.actions[metaHeaders.action] != null) {
					this.actions[metaHeaders.action]({
						client: client,
						clientId: clientId,
						data: message.data,
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
					data: {
						clientIds: SocketClients.ids,
					},
					metaHeaders: {
						action: "UPDATE_CLIENTS_LIST",
						originClientId: clientId,
					},
				})
			})
		})
	}

	static async stop() {
		const server = this.server
		if (!server) {
			return
		}

		this.server = null
		for (const client of server.clients) {
			client.terminate()
		}

		await new Promise(resolve => server.close(resolve))
	}

	static on(action, callback) {
		if (this.actions[action]) {
			throw new Error("can't add duplicate action: " + action)
		}
		else {
			this.actions[action] = callback
		}
	}

	static sendToOthers(originClient, { data = {}, metaHeaders = {} } = {}) {
		const clients = SocketClients.all.filter(c => c != originClient)
		const targetClientIds = clients.map(c => SocketClients.idFrom(c))

		this.sendToClients(clients, {
			data: data,
			metaHeaders: {
				...metaHeaders,
				riginClientId: SocketClients.idFrom(origin),
				argetClientIds: targetClientIds,
			},
		})
	}

	static sendToEveryone({ data = {}, metaHeaders = {} } = {}) {
		const clients = [...SocketClients.all]
		const targetClientIds = clients.map(client => SocketClients.idFrom(client))

		this.sendToClients(clients, {
			data: data,
			metaHeaders: { ...metaHeaders, targetClientIds: targetClientIds },
		})
	}

	static sendToClient(client, { data = {}, metaHeaders = {} } = {}) {
		metaHeaders.targetClientId = SocketClients.idFrom(client)
		client.send(JSON.stringify({ data: data, metaHeaders: metaHeaders }))
	}

	static sendToClients(clients, { data = {}, metaHeaders = {} } = {}) {
		for (const client of clients) {
			this.sendToClient(client, { data: data, metaHeaders: metaHeaders })
		}
	}

}
