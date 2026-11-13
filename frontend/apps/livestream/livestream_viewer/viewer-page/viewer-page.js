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
			onAudioBlocked: () => {
				html.enableSound.hidden = false
			},
			onConnecting: () => {
				html.statusMessage.content = "Connecting to stream…"
			},
			onPlaying: () => {
				if html.fields.status?.online {
					html.statusMessage.content = ""
				}
			},
			onError: error => {
				html.fields.hlsVideo.disconnect()
				html.statusMessage.content = "Connection interrupted; retrying..."
				console.warn("Playback interrupted", error)
			},
		})

		html.videoOverlay.add(html.fields.hlsVideo.video)
		html.enableSound.hidden = !html.fields.hlsVideo.video.muted

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
				}
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
		enableSound: async (html) => {
			const video = html.fields.hlsVideo.video
			video.muted = false
			try {
				await video.play()
				html.enableSound.hidden = true
			}
			catch (error) {
				video.muted = true
				console.warn("Could not enable playback sound", error)
			}
		},
		toggleFullscreen: () => Screen.toggleFullscreen(),
	},
}
