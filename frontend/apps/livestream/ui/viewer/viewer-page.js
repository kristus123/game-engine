export default async ({ html }) => {

	const onChange = AsyncOnChange(() => Stream.online(), async online => {
		if (await online) {
			html.videoOverlay.add(HlsVideo({
				playing: () => {
					html.text.content = ""
				},
				error: () => {
					html.text.content = "Please hold on"
				},
			}))

			html.text.content = ""
		}
		else {
			html.videoOverlay.removeChildren()
			html.text.content = "Stream not online"
		}
	})

	setInterval(async () => {
		await onChange.update()
	}, 1_000)
}
