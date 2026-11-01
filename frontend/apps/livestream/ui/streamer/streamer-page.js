export const page = {
	persistOnClose: true,
}

async function setup(html) {
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
		methods: {
			openMicSettings: () => Page.open("mic-settings-page"),
			selectNextCam: async () => {
				await Stream.swapVideo(cams.nextElementCyclic().deviceId)
			},
			startStream: async () => {
				html.waiting.content = ""

				await Stream.start()
				html.start.hide()
				html.stop.show()
			},
			stopStream: async () => {
				await Stream.stop()

				html.start.show()
				html.stop.hide()
			},
		},
	}

}

export default {
	fields: () => ({ options: null }),
	onFirstDomAdd: async (html) => {
		html.fields.options = await setup(html)
	},
	methods: {
		openMicSettings: (html) => html.fields.options.methods.openMicSettings(),
		selectNextCam: (html) => html.fields.options.methods.selectNextCam(),
		startStream: (html) => html.fields.options.methods.startStream(),
		stopStream: (html) => html.fields.options.methods.stopStream(),
	},
}
