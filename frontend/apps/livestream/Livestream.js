export class Livestream {

	static async start() {
		const html = Page.init("index", H.create("livestream-body"))
		Page.go("index")

		SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
			html.chatHistory.add(H.create("chat-line", {
				slots: {
					name: data.name,
					message: data.message,
				},
			}))
		})
	}

	update() {

	}
}
