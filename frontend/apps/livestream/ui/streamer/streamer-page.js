export const page = {
	persistOnClose: true,
}

async function setup(html) {
	let isPreviewingStream = false
	const streamPreview = document.createElement("video")
	streamPreview.autoplay = false
	streamPreview.playsInline = true
	streamPreview.muted = false
	streamPreview.srcObject = SwappableMediaStream.stream
	streamPreview.css("width: 100%; height: 100%; object-fit: contain; background: black; pointer-events: none;")

	if await Stream.online() {
		html.waiting.content = "someone is already streaming"
		html.stop.show()
	}
	else {
		html.waiting.content = "Stream not online"
		html.start.show()
	}

	try {
		await Permission.request()
	}
	catch (error) {
		console.warn("Microphone access is not available yet", error)
	}

	const chatQueue = PromiseQueue()
	Chat.onMessage(({ message }) => {
		chatQueue.add(() => Tts(message))
	})

	OtherUsers.onCountChange(c => {
		console.log("updating viewcount baby")
		html.viewCount.content = c
	})

	const cams = Permission.granted ? await Cam.all() : []

	return {
		onDomAdd: () => {
			streamPreview.srcObject = SwappableMediaStream.stream
		},
		onDomRemove: () => {
			streamPreview.pause()
			streamPreview.srcObject = null
			isPreviewingStream = false
			html.videoOverlay.clearChildren()
			html.previewToggle.content = "Preview media stream"
			html.previewToggle.title = ""
		},
		methods: {
			openMicSettings: () => Page.open("mic-settings-page"),
			selectNextCam: async () => {
				await Stream.swapVideo(cams.nextElementCyclic().deviceId)
			},
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
					const resumeAudio = SwappableMediaStream.audioContext.resume()
					const startVideo = streamPreview.play()
					await Promise.all([resumeAudio, startVideo])
				}
				catch (error) { // codex, make it so i can do - catch error { - without paranthesis () - and update linter to auto do this
					isPreviewingStream = false
					streamPreview.pause()
					showCameraPreview()
					html.previewToggle.content = "Preview media stream"
					const message = error instanceof Error ? error.message : String(error)
					html.previewToggle.title = `Could not play stream preview: ${message}`
					console.warn("Could not play the outgoing livestream preview", error)
				}
			},
			startStream: async () => {
				html.waiting.content = ""

				await Stream.start()
				if !isPreviewingStream {
					showCameraPreview()
				}

				html.start.hide()
				html.stop.show()
			},
			stopStream: async () => {
				streamPreview.pause()
				isPreviewingStream = false
				html.videoOverlay.clearChildren()
				await Stream.stop()
				html.previewToggle.content = "Preview media stream"
				html.previewToggle.title = ""

				html.start.show()
				html.stop.hide()
			},
		},
	}

	function showCameraPreview() {
		html.videoOverlay.clearChildren()
		html.videoOverlay.add(SwappableMediaStream.video.mirror())
	}

}

export default {
	fields: () => ({ options: null }),
	onFirstDomAdd: async (html) => {
		html.fields.options = await setup(html)
	},
	onDomAdd: (html) => html.fields.options.onDomAdd(),
	onDomRemove: (html) => html.fields.options.onDomRemove(),
	methods: {
		openMicSettings: (html) => html.fields.options.methods.openMicSettings(),
		selectNextCam: (html) => html.fields.options.methods.selectNextCam(),
		togglePreview: (html) => html.fields.options.methods.togglePreview(),
		startStream: (html) => html.fields.options.methods.startStream(),
		stopStream: (html) => html.fields.options.methods.stopStream(),
	},
}
