// ClientId(

export class SocketClient {
	static {
		this.serverListener = {}
		this.clientListener = {}
	
		this.simplifiedSocketClientAPI = new SimplifiedSocketClientAPI(8082, c => {
			c.on('UPDATE_CLIENTS_LIST', data => {
				console.log("add")
				for (const clientId of data.clientIds) {
					ConnectedSocketClients.add(clientId)
				}

				SocketClient.handleCustomListener(this.serverListener, data.action, data)
			})

			c.on('REMOVE_CLIENT', data => {
				console.log("add")
				ConnectedSocketClients.remove(data.clientId)

				SocketClient.handleCustomListener(this.serverListener, data.action, data)
			})

			c.on('CLIENT_TO_CLIENT', data => {
				console.log(`Message: ${JSON.stringify(data)}`)
				
				if (this.clientListener[data.subAction]) {
					this.clientListener[data.subAction](data)
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
		this.serverListener[action] = callback
	}

	static onClientMessage(action, callback) {
		this.clientListener[action] = callback
	}

	static onConnect(callback) {
		this.serverListener['UPDATE_CLIENTS_LIST'] = callback
	}

	static onDisconnect(callback) {
		this.serverListener['REMOVE_CLIENT'] = callback
	}
	
	static handleCustomListener(listener, action, data) {
		if (this.serverListener[action]) {
			this.serverListener[action](data)
		}
		else {
			throw new Error(`Listener For Action "${action}" Is Not Defined!`)
		}
	}
}
