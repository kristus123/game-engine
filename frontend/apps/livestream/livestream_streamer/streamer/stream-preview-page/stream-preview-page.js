export default {
	page: { persistOnClose: false },
	fields: () => ({
		isPreviewingStream: false,
		streamPreview: null,
	}),
	onFirstDomAdd: ({ html }) => {
		const streamPreview = document.createElement("video")
		streamPreview.autoplay = false
		streamPreview.playsInline = true
		streamPreview.muted = false
		streamPreview.srcObject = SwappableMediaStream.mediaStream
		streamPreview.css("width: 100%; height: 100%; object-fit: contain; background: black; pointer-events: none;")
		html.fields.streamPreview = streamPreview
	},
	methods: {
		togglePreview: async (html) => {
			const streamPreview = html.fields.streamPreview
			if html.fields.isPreviewingStream {
				html.fields.isPreviewingStream = false
				streamPreview.pause()
				html.videoOverlay.clearChildren()
				html.videoOverlay.add(SwappableMediaStream.video.mirror())
				html.previewToggle.content = "Preview media stream"
				return
			}

			html.fields.isPreviewingStream = true
			html.previewToggle.content = "Preview camera"
			html.previewToggle.title = ""
			html.videoOverlay.clearChildren()
			html.videoOverlay.add(streamPreview)

			try {
				await Promise.all([SoundContext.resume(), streamPreview.play()])
			}
			catch (error) {
				html.fields.isPreviewingStream = false
				streamPreview.pause()
				html.videoOverlay.clearChildren()
				html.videoOverlay.add(SwappableMediaStream.video.mirror())
				html.previewToggle.content = "Preview media stream"
				const message = error instanceof Error ? error.message : String(error)
				html.previewToggle.title = `Could not play stream preview: ${message}`
				console.warn("Could not play the outgoing livestream preview", error)
			}
		},
	},
	onDomAdd: ({ html }) => {
		html.fields.streamPreview.srcObject = SwappableMediaStream.mediaStream
		html.videoOverlay.clearChildren()
		html.videoOverlay.add(SwappableMediaStream.video.mirror())
	},
	onDomRemove: ({ html }) => {
		html.fields.streamPreview.pause()
		html.fields.streamPreview.srcObject = null
		html.fields.isPreviewingStream = false
		html.videoOverlay.clearChildren()
	},
}
