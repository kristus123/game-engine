export default async ({ html, onConnected }) => {

	SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
		html.chatHistory.add(H.create("chat-line", {
			slots: {
				name: data.name,
				message: data.message,
			},
		}))
	})

	if (await Stream.someoneIsStreaming()) {
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

	onConnected({
		slots: {
			test: "wow",
		},
		on: {
			wow: () => {
				console.log("wow")
			},
			startStream: async () => {
				html.videoOverlay.clearChildren()

				const video = H.streamVideo(await Stream.start())
				video.mirror()
				html.videoOverlay.add(video)

				html.start.hide()
				html.stop.show()
			},
			stopStream: async () => {
				html.videoOverlay.clearChildren()
				Stream.stop()
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
	})
}
