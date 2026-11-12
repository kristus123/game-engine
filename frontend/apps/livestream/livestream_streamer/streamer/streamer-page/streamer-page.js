async function setup(html) {
	const update = state => {
		const messages = {
			offline: "Stream not online",
			starting: "Starting livestream…",
			live: "",
			reconnecting: "Connection interrupted. Reconnecting…",
			stopping: "Stopping livestream when the connection returns…",
			ended: "The previous stream session ended. Start a new livestream to continue.",
			busy: "Someone is already streaming",
		}
		html.waiting.content = messages[state]
		html.start.hidden = Stream.broadcast != null
		html.stop.hidden = Stream.broadcast == null || Stream.broadcast.stopping
		html.livePreview.hidden = Stream.broadcast == null
	}
	Stream.onChange = update
	Stream.init()
	update(Stream.broadcast ? "reconnecting" : Stream.state)

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
		methods: {
			openMicSettings: () => Page.open("mic-settings-page"),
			selectNextCam: async () => {
				if cams.length > 0 {
					await Stream.swapVideo(cams.nextElementCyclic().deviceId)
				}
			},
			startStream: async () => {
				html.start.disabled = true
				try {
					await Stream.start()
				}
				catch (error) {
					html.waiting.content = `Could not start livestream: ${error.message}`
				}
				finally {
					html.start.disabled = false
				}
			},
			previewLiveStream: () => Page.open("viewer-page"),
			stopStream: async () => {
				await Stream.stop()
			},
		},
	}
}

export default {
	page: { persistOnClose: true },
	fields: () => ({ options: null }),
	onFirstDomAdd: async ({ html }) => {
		html.livePreview.srcObject = SwappableMediaStream.mediaStream
		html.livePreview.hidden = Stream.broadcast == null
		html.livePreview.css("width: 100%; height: 100%; object-fit: contain; background: black;")
		html.livePreview.play().catch(error => console.warn("Could not play local stream preview", error))
		html.fields.options = await setup(html)
	},
	onDomAdd: ({ html, onDomRemove }) => {
		html.livePreview.srcObject = SwappableMediaStream.mediaStream
		html.livePreview.play().catch(error => console.warn("Could not play local stream preview", error))
		html.micLevel.css("position: absolute; top: 40px; left: 8px; width: 150px; padding: 6px 10px; color: white; background: #222a; border-radius: 4px;")
		html.micLevelTrack.css("height: 6px; margin-top: 4px; overflow: hidden; background: #777;")
		html.micLevelBar.css("width: 0%; height: 100%; background: #55d66b; transition: width 100ms linear;")
		const levelLoop = SetTimeoutLoop(200, () => {
			const input = SwappableMediaStream.audioInput
			if !input {
				html.micLevelLabel.content = "Mic: unavailable"
				html.micLevelBar.style.width = "0%"
				return
			}

			const level = SwappableMediaStream.audioTrack.db
			html.micLevelLabel.content = Number.isFinite(level) ? `Mic: ${Math.round(level)} dBFS` : "Mic: no signal"
			html.micLevelBar.style.width = `${Number.isFinite(level) ? Math.max(0, Math.min(100, (level + 60) / 60 * 100)) : 0}%`
		})
		onDomRemove(() => levelLoop.stop())
	},
	methods: {
		openMicSettings: (html) => html.fields.options.methods.openMicSettings(),
		selectNextCam: (html) => html.fields.options.methods.selectNextCam(),
		startStream: (html) => html.fields.options.methods.startStream(),
		stopStream: (html) => html.fields.options.methods.stopStream(),
		previewLiveStream: (html) => html.fields.options.methods.previewLiveStream(),
	},
}
