export class SocketClient {

	static {
		this.clientActionListener = ActionListener()
		this.serverActionListener = ActionListener()

		this.serverActionListener.listen("UPDATE_CLIENTS_LIST", data => {
			for (const clientId of data.clientIds) {
				OtherClients.add(clientId)
			}
		})

		this.serverActionListener.listen("REMOVE_CLIENT", data => {
			OtherClients.remove(data.clientId)

			this.clientActionListener.trigger(data.action, data)
		})

		this.serverActionListener.listen("CLIENT_TO_CLIENT", data => {
			this.clientActionListener.trigger(data.subAction, data)
		})

		WebSocketWrapper.onMessage = data => {
			this.serverActionListener.trigger(data.action, data)
		}
	}

	static sendToClient(subAction, targetClientId, data) {
		WebSocketWrapper.send(data.merge({
			action: "CLIENT_TO_CLIENT",
			subAction: subAction,
			originClientId: ClientId,
			targetClientId: targetClientId,
		}))
	}

	// bad name, too similar to sendToClient. consider merging them
	static sendToClients(subAction, targetClientIds, data) {
		for (const targetClientId of targetClientIds) {
			SocketClient.sendToClient(subAction, targetClientId, data)
		}
	}

	static sendToOtherClients(subAction, data) {
		Assert.value(subAction)
		Assert.value(data)

		for (const targetClientId of OtherClients.ids) {
			SocketClient.sendToClient(subAction, targetClientId, data)
		}
	}


	static onServerMessage(action, callback) {
		Assert.value(action)
		Assert.value(callback)

		this.serverActionListener.listen(action, callback)
	}

	static onClientMessage(action, callback) {
		this.clientActionListener.listen(action, callback)
	}
}
