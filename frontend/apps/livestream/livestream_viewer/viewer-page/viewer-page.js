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
				console.warn("Playback interrupted", { name: error.name, message: error.message, code: error.code })
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
		const video = html.fields.hlsVideo.video
		const resize = () => {
			const { width, height } = html.videoOverlay.getBoundingClientRect()
			if width <= 0 || height <= 0 || video.videoWidth <= 0 || video.videoHeight <= 0 {
				return
			}
			const style = getComputedStyle(html)
			const crop = Math.max(0, parseFloat(style.getPropertyValue("--viewer-video-crop")) || 0)
			const minimum = Math.max(0.01, Math.min(1, parseFloat(style.getPropertyValue("--viewer-video-min-visible")) || 1))
			const contain = Math.min(width / video.videoWidth, height / video.videoHeight)
			const cover = Math.max(width / video.videoWidth, height / video.videoHeight)
			const scale = Math.min(cover, (width + 2 * crop) / video.videoWidth, (height + 2 * crop) / video.videoHeight, width / (video.videoWidth * minimum), height / (video.videoHeight * minimum))
			video.style.width = `${video.videoWidth * Math.max(contain, scale)}px`
			video.style.height = `${video.videoHeight * Math.max(contain, scale)}px`
		}
		html.fields.resizeObserver = new ResizeObserver(resize)
		html.fields.resizeObserver.observe(html.videoOverlay)
		html.fields.resizeVideo = resize
		video.addEventListener("loadedmetadata", resize)
		video.addEventListener("resize", resize)
		resize()
	},
	onDomRemove: ({ html }) => {
		html.fields.resizeObserver.disconnect()
		const video = html.fields.hlsVideo.video
		video.removeEventListener("loadedmetadata", html.fields.resizeVideo)
		video.removeEventListener("resize", html.fields.resizeVideo)
		html.fields.statusLoop.stop()
		html.fields.hlsVideo.disconnect()
	},
	methods: {
		enableSound: async (html) => {
			const video = html.fields.hlsVideo.video
			video.muted = false
			html.enableSound.hidden = true
			if !html.fields.hlsVideo.connected {
				return
			}
			try {
				await video.play()
				html.enableSound.hidden = true
			}
			catch (error) {
				if error.name == "NotAllowedError" {
					video.muted = true
					html.enableSound.hidden = false
				}
				console.warn("Could not enable playback sound", error)
			}
		},
		toggleFullscreen: () => Screen.toggleFullscreen(),
	},
}
