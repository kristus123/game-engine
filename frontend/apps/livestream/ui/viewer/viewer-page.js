export const page = {
	persistOnClose: true,
}

function updateSeekButtons(html) {
	const hlsVideo = html.fields.hlsVideo
	html.seekBackward.disabled = !hlsVideo.ready || hlsVideo.video.getSeekTarget(-30) == null
	html.seekForward.disabled = !hlsVideo.ready || hlsVideo.video.getSeekTarget(30) == null
}

export default {
	fields: () => ({
		hlsVideo: null,
		statusLoop: null,
	}),
	onFirstDomAdd: (html) => {
		html.fields.hlsVideo = HlsVideo({
			onConnecting: () => {
				html.text.content = "Connecting to stream…"
				html.utcTime.content = "Playback UTC: waiting for playback time"
			},
			onPlaying: () => {
				html.text.content = ""
			},
			onError: error => {
				html.fields.hlsVideo.disconnect()
				html.text.content = "Connection interrupted; retrying..."
				html.utcTime.content = "Playback UTC: waiting for playback time"
				updateSeekButtons(html)
				console.warn("Playback interrupted", error)
			},
			onSeekableChange: () => {
				updateSeekButtons(html)
			},
			onPlaybackDate: date => {
				html.utcTime.content = `Playback UTC: ${date.toISOString().slice(0, 19)}Z`
			},
		})

		html.videoOverlay.add(html.fields.hlsVideo.video)

		html.fields.statusLoop = SetTimeoutLoop(4_000, async () => {
			try {
				if await Stream.online() {
					await html.fields.hlsVideo.connect()
					if html.fields.hlsVideo.ready {
						html.text.content = ""
					}
				}
				else {
					html.fields.hlsVideo.disconnect()
					html.text.content = "Stream not online"
					html.utcTime.content = "Playback UTC: waiting for playback time"
				}
				updateSeekButtons(html)
			}
			catch (error) {
				html.text.content = "Could not check stream status; retrying…"
				console.warn("Could not check stream status", error)
			}
		}).stop()
	},
	onPageOpen: (html) => {
		html.fields.statusLoop.start()
	},
	onPageClose: (html) => {
		html.fields.statusLoop.stop()
		html.fields.hlsVideo.disconnect()
	},
	methods: {
		seekBackward: (html) => html.fields.hlsVideo.video.seekBy(-30),
		seekForward: (html) => html.fields.hlsVideo.video.seekBy(30),
		makeClip: async (html) => {
			try {
				await ClipCreator.create(html.fields.hlsVideo.playbackUtc)
			}
			catch (e) {
				html.text.content = e.message
			}
		},
		toggleFullscreen: () => Screen.toggleFullscreen(),
	},
}
