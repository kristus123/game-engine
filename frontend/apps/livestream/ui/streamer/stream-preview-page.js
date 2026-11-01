export const page = {
	persistOnClose: false,
}

export default ({ html }) => {
	let isPreviewingStream = false
	const streamPreview = document.createElement("video")
	streamPreview.autoplay = false
	streamPreview.playsInline = true
	streamPreview.muted = false
	streamPreview.srcObject = SwappableMediaStream.stream
	streamPreview.css("width: 100%; height: 100%; object-fit: contain; background: black; pointer-events: none;")

	function showCameraPreview() {
		html.videoOverlay.clearChildren()
		html.videoOverlay.add(SwappableMediaStream.video.mirror())
	}

	return {
		methods: {
			togglePreview: async () => {
				if isPreviewingStream {
					isPreviewingStream = false
					streamPreview.pause()
					showCameraPreview()
					html.previewToggle.content = "Preview media stream"
					return
				}

				isPreviewingStream = true
				html.previewToggle.content = "Preview camera"
				html.previewToggle.title = ""
				html.videoOverlay.clearChildren()
				html.videoOverlay.add(streamPreview)

				try {
					await Promise.all([
						SwappableMediaStream.audioContext.resume(),
						streamPreview.play(),
					])
				}
				catch (error) {
					isPreviewingStream = false
					streamPreview.pause()
					showCameraPreview()
					html.previewToggle.content = "Preview media stream"
					const message = error instanceof Error ? error.message : String(error)
					html.previewToggle.title = `Could not play stream preview: ${message}`
					console.warn("Could not play the outgoing livestream preview", error)
				}
			},
		},
		onPageOpen: () => {
			streamPreview.srcObject = SwappableMediaStream.stream
			showCameraPreview()
		},
		onPageClose: () => {
			streamPreview.pause()
			streamPreview.srcObject = null
			isPreviewingStream = false
			html.videoOverlay.clearChildren()
		},
	}
}
