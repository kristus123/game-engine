// ClientId(

export class SocketClient {
	static {
		this.clientActionListener = new ActionListener()

		const serverActionListener = new ActionListener()

		serverActionListener.register('UPDATE_CLIENTS_LIST', data => {
			for (const clientId of data.clientIds) {
				OtherConnectedSocketClients.add(clientId)
			}

			this.clientActionListener.run(data.action, data)
		})

		serverActionListener.register('REMOVE_CLIENT', data => {
			OtherConnectedSocketClients.remove(data.clientId)

			this.clientActionListener.run(data.action, data)
		})

		serverActionListener.register('CLIENT_TO_CLIENT', data => {
			console.log(`Message: ${JSON.stringify(data)}`)
			this.clientActionListener.run(data.subAction, data)
		})

		WebSocketWrapper.onMessage = data => {
			serverActionListener.run(data.action, data)
		}
	}

	static sendToClient(subAction, targetClientId, data) {
		WebSocketWrapper.send(data.merge({
			action: 'CLIENT_TO_CLIENT',
			subAction: subAction,
			originClientId: ClientId,
			targetClientId: targetClientId,
		}))
	}

	static onServerMessage(action, callback) {
		this.clientActionListener.register(action, callback)
	}

	static onClientMessage(action, callback) {
		this.clientActionListener.register(action, callback)
	}
}
