export default async ({ html }) => {

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
	}
}
