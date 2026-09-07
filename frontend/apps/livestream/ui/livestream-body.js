export default async ({ html }) => {

	SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
		html.chatHistory.add(H.create("chat-line", {
			slots: {
				name: data.name,
				message: data.message,
			},
		}))
	})

	if (await Stream.someoneIsStreaming()) {
		html.buttons.remove()
		html.videoOverlay.add(HlsVideo({
			playing: () => {
				html.waiting.content = ""
			},
			error: () => {
				html.waiting.content = "Please hold on"
			},
		}))
	}
	else {
		html.waiting.content = "Stream not online"
		html.start.show()
	}

	return {
		slots: {
			test: "wow",
		},
		methods: {
			startStream: async () => {
				await Permission.requestAll()
				html.waiting.content = ""

				try {
					await Stream.start()
					html.videoOverlay.clearChildren()
					html.videoOverlay.add(SwappableMediaStream.video.mirror())

					html.start.hide()
					html.stop.show()
				}
				catch (e) {
					console.log(e)
					throw e
				}
			},
			stopStream: async () => {
				html.videoOverlay.clearChildren()
				Stream.stop()

				html.start.show()
				html.stop.hide()
			},
			swap: () => {
				Stream.swap()
			},
			sendMessage: () => {
				const message = html.message.value
				html.message.clear()

				SocketClient.sendToAllClients("NEW_CHAT_MESSAGE", {
					name: "brukernavn",
					message: message,
				})
			},
		},
	}
}
