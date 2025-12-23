export class SocketClient {
	constructor() {
		this.client_listeners = {}

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
				if (data.targetClientId != c.clientId) {
					return
				}

				const message = data.json

				console.log(`Message: ${JSON.stringify(message)}`)

				if (this.client_listeners[message.action]) {
					this.client_listeners[message.action](message)
				} else {
					throw new Error(`Listener For Action "${message.action}" Is Not Defined!`)
				}
			})
		})
	}


	sendToClient(action, targetClientId, data) {
		this.simplifiedSocketClientAPI.send({
			action: 'CLIENT_TO_CLIENT',
			json: {
				action: action,
				originClientId: ClientId,
				targetClientId: targetClientId,
				data: data
			}
		})
	}

	on(action, callback) {
		this.simplifiedSocketClientAPI.on(action, callback)
	}
	
	onClientMessage(action, callback) {
		this.client_listeners[action] = callback
	}
}
