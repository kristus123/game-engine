export class Chat {

	static _onMsg = Listener()

	static {
		SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
			this._onMsg.trigger({ name: data.name, message: data.message })
		})
	}

	static onMessage(callback) {
		this._onMsg.listen(callback)
	}

	static sendMessage(message) {
		SocketClient.sendToAllClients("NEW_CHAT_MESSAGE", {
			name: "brukernavn",
			message: message,
		})
	}
}
