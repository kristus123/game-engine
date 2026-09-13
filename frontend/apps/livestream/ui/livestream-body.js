export default async ({ html }) => {

	Permission.request()

	SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
		console.log(data)
		html.chatHistory.add(H.create("chat-line", {
			slots: {
				name: data.name,
				message: data.message,
			},
		}))

		Tts(data.message)
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
			openMicSettings: async () => {
				html.micSettings.clearChildren()
				html.micSettings.show()

				for (const m of await Mic.all()) {
					console.log(m)
					html.micSettings.add(H.button(m.label, () => {
						Stream.swapAudio(m.deviceId)
					}))
				}
			},
			startStream: async () => {
				html.waiting.content = "awaiting permission"
				await Permission.request()
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
			swapAudio: () => {
				Stream.swapAudio()
			},
			swapVideo: () => {
				Stream.swapVideo()
			},
			sendMessage: () => {
				const message = html.message.value
				console.log(message)
				html.message.clear()

				SocketClient.sendToAllClients("NEW_CHAT_MESSAGE", {
					name: "brukernavn",
					message: message,
				})
			},
		},
	}
}
