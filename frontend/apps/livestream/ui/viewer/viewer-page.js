export default async ({ html }) => {
	let player = null
	let playbackUtc = null
	let lastOnline = null
	let pollDelayMs = 1_000
	let isCheckingStream = false

	const chaosFeature = "VIEWER_PAGE"

	const updatePlayer = online => {
		if (online) {
			if (player != null) {
				return
			}

			let nextPlayer = null
			nextPlayer = HlsVideo({
				playing: () => {
					if (player == nextPlayer) {
						html.text.content = ""
					}
				},
				error: () => {
					if (player == nextPlayer) {
						html.text.content = "Please hold on"
					}
				},
				onPlaybackDate: date => {
					if (player != nextPlayer) {
						return
					}

					playbackUtc = date
					html.utcTime.content = `UTC: ${date.toISOString().slice(0, 19)}Z`
				},
			})
			player = nextPlayer
			html.videoOverlay.add(nextPlayer)
			html.text.content = "Connecting to stream…"
		}
		else {
			player?.destroyHls()
			player = null
			playbackUtc = null
			html.videoOverlay.removeChildren()
			html.utcTime.content = "Waiting for UTC playback time"
			html.text.content = "Stream not online"
		}
	}

	const pollStreamStatus = async () => {
		if (isCheckingStream) {
			return
		}

		isCheckingStream = true
		try {
			await ChaosMonkey.delay({ feature: chaosFeature, minMs: 0, maxMs: 300 })
			ChaosMonkey.maybeCrash({
				feature: chaosFeature,
				message: "viewer stream status poll",
				chance: 0.1,
			})

			const online = await Stream.online()
			pollDelayMs = 1_000
			if (online != lastOnline) {
				updatePlayer(online)
				lastOnline = online
			}
			else if (online && player?.readyState >= 2) {
				html.text.content = ""
			}
			else if (online && html.text.content == "Connection interrupted; retrying…") {
				html.text.content = "Connecting to stream…"
			}
		}
		catch (e) {
			pollDelayMs = Math.min(pollDelayMs * 2, 10_000)
			html.text.content = player == null
				? "Checking stream; retrying…"
				: "Connection interrupted; retrying…"
			console.warn("Could not check stream status; will retry", e)
		}
		finally {
			isCheckingStream = false
			setTimeout(pollStreamStatus, pollDelayMs)
		}
	}

	pollStreamStatus()

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
