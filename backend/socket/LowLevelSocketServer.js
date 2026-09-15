import { WebSocketServer } from "ws"

export class LowLevelSocketServer {
	constructor({ onConnection, onClose } = {}) {
		this.onConnection = onConnection
		this.onClose = onClose

		this.actions = {}
	}

	start(server) {
		const webSocketServer = new WebSocketServer({ server: server })

		webSocketServer.on("connection", (client, request) => {
			const urlParameters = new URLSearchParams(request.url.split("?")[1])
			const clientId = urlParameters.get("clientId")
			this.onConnection(client, clientId)

			client.on("message", data => {
				try {
					data = JSON.parse(data)

					if (this.actions[data.action]) {
						this.actions[data.action](client, clientId, data)
					}
				}
				catch (e) {
					throw e
				}
			})

			client.on("close", () => {
				this.onClose(client, clientId)
			})
		})
	}

	on(action, callback) {
		this.actions[action] = callback
	}
}
