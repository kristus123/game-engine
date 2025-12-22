export class SocketClient {
	constructor() {
		this.socketClient = new SimplifiedSocketClientAPI(8082, c => {
			c.on('UPDATE_CLIENTS_LIST', data => {
				for (const clientId of data.clientIds) {
					if (!c.connectedClientIds.includes(clientId)) {
						c.connectedClientIds.push(clientId)
					}
				}
				console.log(c.connectedClientIds)
			})

			c.on('REMOVE_CLIENT', data => {
				const index = c.connectedClientIds.indexOf(data.clientId)
				c.connectedClientIds.splice(index, 1)
				console.log(c.connectedClientIds)

			})

			c.on('CLIENT_TO_CLIENT', data => {
				if (data.targetClientId != c.clientId) {
					return
				}
				console.log(`Message: ${data.json}`)
			})
		})
	}

	send(data) {
		this.socketClient.send({
			originClientId: this.clientId,
			json: data
		})
	}

	sendToClient(targetClientId, data) {
		this.socketClient.send({
			action: 'CLIENT_TO_CLIENT',
			targetClientId: targetClientId,
			originClientId: this.clientId,
			json: data
		})
	}

	on(action, callback) {
		this.socketClient.on(action, callback)
	}
}
