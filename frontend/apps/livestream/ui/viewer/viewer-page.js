function updateSeekButtons(html) {
	const hlsVideo = html.fields.hlsVideo
	html.seekBackward.disabled = !hlsVideo.ready || hlsVideo.video.getSeekTarget(-30) == null
	html.seekForward.disabled = !hlsVideo.ready || hlsVideo.video.getSeekTarget(30) == null
}

export default {
	page: {
		persistOnClose: true,
	},
	fields: () => ({
		hlsVideo: null,
		statusLoop: null,
		status: null,
	}),
	onFirstDomAdd: ({ html }) => {
		html.fields.hlsVideo = HlsVideo({
			onConnecting: () => {
				html.statusMessage.content = "Connecting to stream…"
				html.utcTime.content = "Playback UTC: waiting for playback time"
			},
			onPlaying: () => {
				if html.fields.status?.online {
					html.statusMessage.content = ""
				}
			},
			onError: error => {
				html.fields.hlsVideo.disconnect()
				html.statusMessage.content = "Connection interrupted; retrying..."
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

		html.fields.statusLoop = SetTimeoutLoop(1_000, async () => {
			try {
				const status = await Stream.status()
				if !html.isConnected {
					return
				}
				html.fields.status = status
				if status.online {
					html.fields.hlsVideo.connect(status.playbackId)
					if html.fields.hlsVideo.ready {
						html.statusMessage.content = ""
					}
				}
				else {
					html.fields.hlsVideo.disconnect()
					html.statusMessage.content = status.state == "reconnecting"
						? `The streamer disconnected. They may be back soon. Waiting ${Math.ceil(status.remainingMs / 1_000)}s…`
						: status.state == "starting" ? "The stream is starting…" : "Stream offline"
					html.utcTime.content = "Playback UTC: waiting for playback time"
				}
				updateSeekButtons(html)
			}
			catch (error) {
				if html.isConnected {
					html.statusMessage.content = Network.offline
						? "Your connection is offline. Reconnecting…"
						: "Could not check stream status; retrying…"
				}
				console.warn("Could not check stream status", error)
			}
		}).stop()
	},
	onDomAdd: ({ html }) => {
		html.fields.statusLoop.start()
	},
	onDomRemove: ({ html }) => {
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
				html.statusMessage.content = e.message
			}
		},
		toggleFullscreen: () => Screen.toggleFullscreen(),
	},
}
