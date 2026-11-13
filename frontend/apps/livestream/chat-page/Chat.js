export class Chat {

	static _onMessage = Listener()
	static history = []

	static {
		SocketClient.onClientMessage("NEW_CHAT_MESSAGE", ({ data }) => {
			if typeof data?.name != "string" || typeof data?.message != "string" || !data.message.trim() {
				return
			}
			const line = { name: data.name.slice(0, 100), message: data.message.slice(0, 2_000) }
			this.history.push(line)
			if this.history.length > 200 {
				this.history.shift()
			}
			this._onMessage.trigger(line)
		})
	}

	static onMessage(callback) {
		this._onMessage.listen(callback)
	}

	static sendMessage(message) {
		message = message.trim().slice(0, 2_000)
		if !message {
			return
		}
		SocketClient.sendToAllUsers("NEW_CHAT_MESSAGE", {
			name: "...",
			message: message,
		})
	}
}
