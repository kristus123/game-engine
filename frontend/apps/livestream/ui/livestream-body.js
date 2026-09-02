export default async html => {

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


}
