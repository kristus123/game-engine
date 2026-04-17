import { WebSocketServer } from "ws"
import { Flask } from "#root/server/http/Flask.js"

export default class {
	constructor({onConnection, onClose} = {}) {
		this.onConnection = onConnection
		this.onClose = onClose

		this.actions = {}
	}

	start() {
		const server = Flask.server

		const webSocketServer = new WebSocketServer({ server })

		webSocketServer.on("connection", (client, request) => {
			console.log("hahah")

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
					throw new Error(e)
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
