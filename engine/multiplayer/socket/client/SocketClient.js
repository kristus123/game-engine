// ClientId(

export class SocketClient {
	static {
		this.clientListeners = {}

		this.simplifiedSocketClientAPI = new SimplifiedSocketClientAPI(8082, c => {
			c.on('UPDATE_CLIENTS_LIST', data => {
				for (const clientId of data.clientIds) {
					ConnectedSocketClients.add(clientId)
				}
			})

			c.on('REMOVE_CLIENT', data => {
				ConnectedSocketClients.remove(data.clientId)
			})

			c.on('CLIENT_TO_CLIENT', data => {
				console.log(`Message: ${JSON.stringify(data)}`)

				if (this.clientListeners[data.subAction]) {
					this.clientListeners[data.subAction](data)
				}
				else {
					throw new Error(`Listener For Sub-Action "${data.subAction}" Is Not Defined!`)
				}
			})
		})
	}


	static sendToClient(subAction, targetClientId, data) {
		this.simplifiedSocketClientAPI.send(data.merge({
			action: 'CLIENT_TO_CLIENT',
			subAction: subAction,
			originClientId: ClientId,
			targetClientId: targetClientId,
		}))
	}

	static onServerMessage(action, callback) {
		this.simplifiedSocketClientAPI.on(action, callback)
	}

	static onClientMessage(action, callback) {
		this.clientListeners[action] = callback
	}

    static onConnect(callback) {
	SocketClient.onServerMessage('UPDATE_CLIENTS_LIST', callback)
    }

    static onDisconnect(callback) {
	SocketClient.onServerMessage('REMOVE_CLIENT', callback)
    }
}
