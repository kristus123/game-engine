export default async ({ html }) => {
	let isCheckingStream = false
	let statusPoll = null

	const updateSeekButtons = () => {
		html.seekBackward.disabled = hlsVideo.getSeekTarget(-30) == null
		html.seekForward.disabled = hlsVideo.getSeekTarget(30) == null
	}

	const hlsVideo = HlsVideo({
		onConnecting: () => {
			html.text.content = "Connecting to stream…"
			html.utcTime.content = "Playback UTC: waiting for playback time"
		},
		onPlaying: () => {
			html.text.content = ""
		},
		onError: () => {
			html.text.content = "Connection interrupted; retrying…"
			pollStreamStatus()
		},
		onSeekableChange: updateSeekButtons,
		onPlaybackDate: date => {
			html.utcTime.content = `Playback UTC: ${date.toISOString().slice(0, 19)}Z`
		},
	})
	html.videoOverlay.add(hlsVideo.video)

	const updateHlsVideo = online => {
		if (online) {
			hlsVideo.start()
			updateSeekButtons()
		}
		else {
			hlsVideo.stop()
			updateSeekButtons()
			html.utcTime.content = "Playback UTC: waiting for playback time"
			html.text.content = "Stream not online"
		}
	}

	const pollStreamStatus = async () => {
		if (isCheckingStream) {
			return
		}

		clearTimeout(statusPoll)
		isCheckingStream = true
		try {
			const online = await Stream.online()
			updateHlsVideo(online)
			if (online && hlsVideo.ready) {
				html.text.content = ""
			}
			else if (online && html.text.content == "Connection interrupted; retrying…") {
				html.text.content = "Connecting to stream…"
			}
		}
		catch (e) {
			html.text.content = !hlsVideo.playing
				? "Checking stream; retrying…"
				: "Connection interrupted; retrying…"
			console.warn("Could not check stream status; will retry", e)
		}
		finally {
			isCheckingStream = false
			statusPoll = setTimeout(pollStreamStatus, 4_000)
		}
	}

	pollStreamStatus()

	return {
		neverDestroy: true,
		methods: {
			seekBackward: () => hlsVideo.seekBy(-30),
			seekForward: () => hlsVideo.seekBy(30),
			makeClip: async () => {
				try {
					await ClipCreator.create(hlsVideo.playbackUtc)
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
