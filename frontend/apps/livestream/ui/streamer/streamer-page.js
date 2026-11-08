async function setup(html) {
	const update = state => {
		const messages = {
			offline: "Stream not online",
			starting: "Starting livestream…",
			live: "",
			reconnecting: "Connection interrupted. Reconnecting…",
			stopping: "Stopping livestream when the connection returns…",
			ended: "The reconnect window expired. Start a new livestream when ready.",
			busy: "Someone is already streaming",
		}
		html.waiting.content = messages[state]
		html.start.hidden = Stream.broadcast != null
		html.stop.hidden = Stream.broadcast == null || Stream.broadcast.stopping
	}
	Stream.changes.listen(update)
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
		html.fields.options = await setup(html)
	},
	methods: {
		openMicSettings: (html) => html.fields.options.methods.openMicSettings(),
		selectNextCam: (html) => html.fields.options.methods.selectNextCam(),
		startStream: (html) => html.fields.options.methods.startStream(),
		stopStream: (html) => html.fields.options.methods.stopStream(),
	},
}
