export default async ({ html }) => {
	let player = null
	let playbackUtc = null
	let lastOnline = null
	let pollDelayMs = 1_000
	let isCheckingStream = false

	const updateSeekButtons = () => {
		html.seekBackward.disabled = player?.getSeekTarget(-30) == null
		html.seekForward.disabled = player?.getSeekTarget(30) == null
	}

	const updatePlayer = async online => {
		if (online) {
			if (player != null) {
				return
			}

			html.text.content = "Connecting to stream…"
			html.utcTime.content = "Playback UTC: waiting for playback time"
			playbackUtc = null
			const nextPlayer = HlsVideo({
				onPlaying: () => html.text.content = "",
				onError: () => {
					if (player != nextPlayer) {
						return
					}

					nextPlayer.stop()
					player = null
					updateSeekButtons()
					playbackUtc = null
					html.videoOverlay.removeChildren()
					html.utcTime.content = "Playback UTC: waiting for playback time"
					html.text.content = "Please hold on"
				},
				onSeekableChange: () => {
					if (player == nextPlayer) {
						updateSeekButtons()
					}
				},
				onPlaybackDate: date => {
					if (player != nextPlayer) {
						return
					}

					playbackUtc = date
					html.utcTime.content = `Playback UTC: ${date.toISOString().slice(0, 19)}Z`
				},
			})
			player = nextPlayer
			html.videoOverlay.add(nextPlayer.element)
			try {
				await nextPlayer.start()
			}
			catch (e) {
				nextPlayer.stop()
				player = null
				updateSeekButtons()
				html.videoOverlay.removeChildren()
				throw e
			}
		}
		else {
			player?.stop()
			player = null
			updateSeekButtons()
			playbackUtc = null
			html.videoOverlay.removeChildren()
			html.utcTime.content = "Playback UTC: waiting for playback time"
			html.text.content = "Stream not online"
		}
	}

	const pollStreamStatus = async () => {
		if (isCheckingStream) {
			return
		}

		isCheckingStream = true
		try {
			const online = await Stream.online()
			pollDelayMs = 1_000
			if (online != lastOnline || (online && player == null)) {
				await updatePlayer(online)
				lastOnline = online
			}
			else if (online && player?.element.readyState >= 2) {
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
			seekBackward: () => player?.seekBy(-30),
			seekForward: () => player?.seekBy(30),
			makeClip: async () => {
				try {
					await ClipCreator.create(playbackUtc)
				}
				catch (e) {
					html.text.content = e.message
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
