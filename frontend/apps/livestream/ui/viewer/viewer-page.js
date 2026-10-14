export const page = {
	persistOnClose: true,
}

export default async ({ html }) => {
	const updateSeekButtons = () => {
		html.seekBackward.disabled = !hlsVideo.ready || hlsVideo.video.getSeekTarget(-30) == null
		html.seekForward.disabled = !hlsVideo.ready || hlsVideo.video.getSeekTarget(30) == null
	}

	const hlsVideo = HlsVideo({
		onConnecting: () => {
			html.text.content = "Connecting to stream…"
			html.utcTime.content = "Playback UTC: waiting for playback time"
		},
		onPlaying: () => {
			html.text.content = ""
		},
		onError: error => {
			hlsVideo.disconnect()
			html.text.content = "Connection interrupted; retrying..."
			html.utcTime.content = "Playback UTC: waiting for playback time"
			updateSeekButtons()
			console.warn("Playback interrupted", error)
		},
		onSeekableChange: () => {
			updateSeekButtons()
		},
		onPlaybackDate: date => {
			html.utcTime.content = `Playback UTC: ${date.toISOString().slice(0, 19)}Z`
		},
	})

	html.videoOverlay.add(hlsVideo.video)

	const statusLoop = SetTimeoutLoop(4_000, async () => {
		try {
			if await Stream.online() {
				await hlsVideo.connect()
				if hlsVideo.ready {
					html.text.content = ""
				}
			}
			else {
				hlsVideo.disconnect()
				html.text.content = "Stream not online"
				html.utcTime.content = "Playback UTC: waiting for playback time"
			}
			updateSeekButtons()
		}
		catch (error) {
			html.text.content = "Could not check stream status; retrying…"
			console.warn("Could not check stream status", error)
		}
	}).stop()

	return {
		onOpen: () => {
			statusLoop.start()
		},
		onClose: () => {
			statusLoop.stop()
			hlsVideo.disconnect()
		},
		methods: {
			seekBackward: () => hlsVideo.video.seekBy(-30),
			seekForward: () => hlsVideo.video.seekBy(30),
			makeClip: async () => {
				try {
					await ClipCreator.create(hlsVideo.playbackUtc)
				}
				catch (e) {
					html.text.content = e.message
				}
			},
			toggleFullscreen: () => Screen.toggleFullscreen(),
		},
	}
}
