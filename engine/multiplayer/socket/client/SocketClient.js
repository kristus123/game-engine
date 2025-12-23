export class SocketClient {
	constructor() {
		// ClientId(
		this.clientListeners = {}

		this.simplifiedSocketClientAPI = new SimplifiedSocketClientAPI(8082, c => {
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
				if (data.targetClientId != ClientId) {
					return
				}

				console.log(`Message: ${JSON.stringify(data)}`)

				if (this.clientListeners[data.subAction]) {
					this.clientListeners[data.subAction](data)
				} else {
					throw new Error(`Listener For Sub-Action "${data.subAction}" Is Not Defined!`)
				}
			})
		})
	}


	sendToClient(subAction, targetClientId, data) {
		this.simplifiedSocketClientAPI.send({
			action: 'CLIENT_TO_CLIENT',
			subAction: subAction,
			originClientId: ClientId,
			targetClientId: targetClientId,
			data: data
		})
	}

	onServerMessage(action, callback) {
		this.simplifiedSocketClientAPI.on(action, callback)
	}
	
	onClientMessage(action, callback) {
		this.clientListeners[action] = callback
	}
}
