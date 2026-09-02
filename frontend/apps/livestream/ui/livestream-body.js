export default async ({ html, onConnected }) => {

	if (await Stream.someoneIsStreaming()) {
		html.videoOverlay.add(HlsVideo({
			playing: () => {
				html.getId("waiting").content = ""
			},
			error: () => {
				html.getId("waiting").content = "Please hold on"
			},
		}))
	}
	else {
		html.getId("waiting").content = "Stream not online"
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
