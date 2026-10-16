export class Chat {

	static _onMessage = Listener()

	static {
		SocketClient.onClientMessage("NEW_CHAT_MESSAGE", ({ data }) => {
			this._onMessage.trigger({ name: data.name, message: data.message })
		})
	}

	static onMessage(callback) {
		this._onMessage.listen(callback)
	}

	static sendMessage(message) {
		SocketClient.sendToAllUsers("NEW_CHAT_MESSAGE", {
			name: "brukernavn",
			message: message,
		})
	}
}
