export default async ({ html }) => {
	let player = null
	let playbackUtc = null

	const onChange = AsyncOnChange(() => Stream.online(), async online => {
		if (await online) {
			player = HlsVideo({
				playing: () => {
					html.text.content = ""
				},
				error: () => {
					html.text.content = "Please hold on"
				},
				onPlaybackDate: date => {
					playbackUtc = date
					html.utcTime.content = `UTC: ${date.toISOString().slice(0, 19)}Z`
				},
			})
			html.videoOverlay.add(player)

			html.text.content = ""
		}
		else {
			player?.destroyHls()
			player = null
			playbackUtc = null
			html.videoOverlay.removeChildren()
			html.text.content = "Stream not online"
		}
	})

	setInterval(async () => {
		await onChange.update()
	}, 1_000)

	return {
		methods: {
			makeClip: async () => {
				const clipTab = window.open("about:blank", "_blank")
				if (!clipTab) {
					html.text.content = "Allow pop-ups to open the clip"
					return
				}

				if (!playbackUtc) {
					clipTab.close()
					html.text.content = "Waiting for UTC playback time"
					return
				}

				try {
					const response = await JsonHttpClient.makeTwitchClip({
						body: {
							endUtc: playbackUtc.toISOString(),
							durationSeconds: 30,
						},
						timeoutMs: 120_000,
					})
					const clip = await Assert.ok(response)
					clipTab.opener = null
					clipTab.location.href = `${Config.httpUrl}/${clip.path}`
				}
				catch (e) {
					clipTab.document.title = "Clip unavailable"
					clipTab.document.body.textContent = `Could not make clip: ${e.message}`
					clipTab.opener = null
					html.text.content = e.message
					console.error(e)
				}
			},
			toggleFullscreen: () => {
				if (Screen.fullscreen) {
					Screen.exitFullscreen()
				}
				else {
					Screen.enterFullscreen()
				}
			},
		},
	}
}
