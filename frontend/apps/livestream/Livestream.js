export class Livestream {

	constructor() {
		const html = Dom.add(Html.livestream())


		SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
			html.chatHistory.add(H.create("chat-line", {
				slots: {
					name: data.name,
					message: data.message,
				},
			}))
		})

		html.message.onEnter(m => {
			html.message.clear()

			SocketClient.sendToAllClients("NEW_CHAT_MESSAGE", {
				name: "brukernavn",
				message: m,
			})
		})

		Execute(async () => {
			if (await Stream.active()) {
				html.videoOverlay.add(HlsVideo())
			}
			else {
				html.start.show()
			}
		})

		html.start.onClick(() => {
			Stream.start(stream => {
				html.videoOverlay.add(H.streamVideo(stream).mirror())
			})
		})
	}

	update() {

	}
}
