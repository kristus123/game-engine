export class SocketClient {

	static {
		this.clientActionListener = ActionListener()
		this.serverActionListener = ActionListener()

		this.onRemovedClient = (clientId) => {}

		this.serverActionListener.listen("UPDATE_CLIENTS_LIST", data => {
			for (const clientId of data.clientIds) {
				OtherClients.add(clientId)
			}
		})

		this.serverActionListener.listen("REMOVE_CLIENT", data => {
			OtherClients.remove(data.clientId)

			this.onRemovedClient(data.clientId)
		})

		this.serverActionListener.listen("CLIENT_TO_CLIENT", data => {
			this.clientActionListener.trigger(data.subAction, data)
		})

		LowLevelSocketClient.onMessage = data => {
			this.serverActionListener.trigger(data.action, data)
		}
	}

	static sendToServer(action, data) {
		LowLevelSocketClient.send(data.merge({
			action: action,
			originClientId: My.clientId
		}))
	}

	static sendToClient(subAction, targetClientIds, data) {
		for (const id of Always.list(targetClientIds)) {
			this.sendToServer("CLIENT_TO_CLIENT", data.merge({
				subAction: subAction,
				targetClientId: id,
			}))
		}
	}

	static sendToOtherClients(subAction, data) {
		for (const targetClientId of OtherClients.ids) {
			SocketClient.sendToClient(subAction, targetClientId, data)
		}
	}

	static onServerMessage(action, callback) {
		this.serverActionListener.listen(action, callback)
	}

	static onClientMessage(action, callback) {
		this.clientActionListener.listen(action, callback)
	}
}
