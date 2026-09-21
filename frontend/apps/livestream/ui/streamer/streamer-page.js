export default async ({ html }) => {

	if (await Stream.someoneIsStreaming()) {
		html.waiting.content = "someoneIsStreaming"
	}
	else {
		html.waiting.content = "Stream not online"
		html.start.show()
	}

	Chat.onMessage(({ user, message }) => {

	})

	await Permission.request()
	const cams = await Cam.all()

	return {
		methods: {
			openMicSettings: async () => {
				html.micSettings.clearChildren()
				html.micSettings.show()

				for (const m of await Mic.all()) {
					html.micSettings.add(H.button(m.label, () => {
						Stream.swapAudio(m.deviceId)
						html.micSettings.hide()
					}))
				}
			},
			selectNextCam: async () => {
				await Stream.swapVideo(cams.nextElementCyclic().deviceId)
			},
			startStream: async () => {
				html.waiting.content = ""

				await Stream.start()
				html.videoOverlay.clearChildren()
				html.videoOverlay.add(SwappableMediaStream.video.mirror())

				html.start.hide()
				html.stop.show()
			},
			stopStream: async () => {
				html.videoOverlay.clearChildren()
				await Stream.stop()

				html.start.show()
				html.stop.hide()
			},
		},
	}
}
