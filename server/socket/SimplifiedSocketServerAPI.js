import LowLevelSocketServer from "#root/server/socket/LowLevelSocketServer.js"
import List from "#root/server/socket/List.js"

let totalClasses = 0

import crypto from "crypto"

const RUNNER_ID = crypto.randomUUID()



export default class {
	constructor() {
		console.log("🔥 Runner booted:", RUNNER_ID, "PID:", process.pid)

		totalClasses += 1
		console.log("total classes xxxx: " + totalClasses)

		setInterval(() => {
			console.log(this.allClients.length)
		}, 1000);

		this._allClients = []
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
				console.log("triggered onClose")
			}
		})
	}

	get allClients() {
		console.log("getting clients list")
		return this._allClients
	}

	sendToOthers(origin, data) {
		for (const client of this.allClients) {
			if (client !== origin) {
				client.send(JSON.stringify(data))
			}
		}
	}

	sendToEveryone(data) { // todo maybe pass client first just to keep it consistent
		for (const client of this.allClients) {
			client.send(JSON.stringify(data))
		}
	}

	sendToClient(client, data) {
		client.send(JSON.stringify(data))
	}

	on(action, callback) {
		this.lowLevelSocketServer.on(action, callback)
	}

	start() {
		this.lowLevelSocketServer.start()
	}
}

