
import { WebSocketServer } from "ws"

export class LowLevelSocketServer {
	constructor({ onConnection, onClose } = {}) {
super()
			Assert.notNull(onConnection, 'param 1 - onConnection - LowLevelSocketServer.constructor')
			Assert.notNull(onClose, 'param 2 - onClose - LowLevelSocketServer.constructor')
		this.onConnection = onConnection; 
		this.onClose = onClose; 

		this.onConnection = onConnection
		this.onClose = onClose

		this.actions = {}
	}

	start(server) {
			Assert.notNull(server, 'param 1 - server - LowLevelSocketServer.start')
		const webSocketServer = new WebSocketServer({ server: server })

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
			Assert.notNull(action, 'param 1 - action - LowLevelSocketServer.on')
			Assert.notNull(callback, 'param 2 - callback - LowLevelSocketServer.on')
		this.actions[action] = callback
	}
}
