// ClientId(

export class SocketClient {
	static {
		this.clientActionListener = ActionListener()

		const serverActionListener = ActionListener()

		serverActionListener.listen('UPDATE_CLIENTS_LIST', data => {
			for (const clientId of data.clientIds) {
				OtherClients.add(clientId)
			}

			this.clientActionListener.trigger(data.action, data)
		})

		serverActionListener.listen('REMOVE_CLIENT', data => {
			OtherClients.remove(data.clientId)

			this.clientActionListener.trigger(data.action, data)
		})

		serverActionListener.listen('CLIENT_TO_CLIENT', data => {
			console.log(`Message: ${JSON.stringify(data)}`)
			this.clientActionListener.trigger(data.subAction, data)
		})

		WebSocketWrapper.onMessage = data => {
			serverActionListener.trigger(data.action, data)
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
		this.clientActionListener.listen(action, callback)
	}

	static onClientMessage(action, callback) {
		this.clientActionListener.listen(action, callback)
	}
}
