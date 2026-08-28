export class Livestream {

	constructor() {
		const html = Dom.add(Html.livestream())

		html.openChat.onClick(() => {
			html.chat.show()
		})

		html.closeChat.onClick(() => {
			html.chat.hide()
		})

		html.start.onClick(() => {
			Stream.start()
		})

		html.chatHistory.add(H.create("chat-line"))
		html.chatHistory.add(H.create("chat-line"))
		html.chatHistory.add(H.create("chat-line"))
	}

	update() {

	}
}
