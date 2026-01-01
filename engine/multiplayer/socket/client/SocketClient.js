// ClientId(

export class SocketClient {
	static {
		this.actionListener = new ActionListener()

		this.simplifiedSocketClientAPI = new SimplifiedSocketClientAPI(c => {
			c.on('UPDATE_CLIENTS_LIST', data => {
				for (const clientId of data.clientIds) {
					ConnectedSocketClients.add(clientId)
				}

				this.actionListener.run(data.action, data)
			})

			c.on('REMOVE_CLIENT', data => {
				ConnectedSocketClients.remove(data.clientId)

				this.actionListener.run(data.action, data)
			})

			c.on('CLIENT_TO_CLIENT', data => {
				console.log(`Message: ${JSON.stringify(data)}`)

				this.actionListener.run(data.subAction, data)
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
		this.actionListener.register(action, callback)
	}

	static onClientMessage(action, callback) {
		this.actionListener.register(action, callback)
	}
}
