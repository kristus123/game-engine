export class Chat {

	static onMessage = Listener()

	static {
		SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
			this.onMessage.trigger({ name: data.name, message: data.message })
		})
	}

	static onMessage(callback) {
		this.onMessage.listen(callback)
	}

	static sendMessage(message) {
		SocketClient.sendToAllClients("NEW_CHAT_MESSAGE", {
			name: "brukernavn",
			message: message,
		})
	}
}
