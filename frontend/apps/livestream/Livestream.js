export class Livestream {

	static async start() {
		const html = Dom.add(Html.livestream({
			on: {
				startStream: async () => {
					html.videoOverlay.clearChildren()
					const v = H.streamVideo(await Stream.start())
					html.videoOverlay.add(v.mirror())
				},
				stopStream: async () => {
					html.videoOverlay.clearChildren()
					Stream.stop()
				},
				sendMessage: () => {
					html.message.clear()
					SocketClient.sendToAllClients("NEW_CHAT_MESSAGE", {
						name: "brukernavn",
						message: m,
					})
				},
			},
		}))

		if (await Stream.someoneIsStreaming()) {
			html.videoOverlay.add(HlsVideo({
				playing: () => {
					html.waiting.text("")
				},
				error: () => {
					html.waiting.text("Please hold on")
				},
			}))
		}
		else {
			html.waiting.text("Stream not online")
			html.start.show()
		}

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
