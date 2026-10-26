export const page = {
	persistOnClose: true,
}

export default {
	fields: () => ({
		cardDb: null,
		direction: null,
		frontSound: null,
		backSound: null,
	}),
	onFirstDomAdd: async (html) => {
		html.fields.cardDb = await CardDb()
		Mic.deviceId = "default"
		console.log(await Mic.all())
	},
	methods: {
		save: async (html) => {
			console.log("caling save")
			await html.fields.cardDb.save({ frontSound: html.fields.frontSound, backSound: html.fields.backSound })
			html.playFront.disable()
			html.playBack.disable()
			html.save.disable()

			html.fields.frontSound = null
			html.fields.backSound = null
		},
		recordFront: (html) => {
			html.fields.direction = "front"
			Mic.startRecording(() => {
			})
		},
		playFront: (html) => {
			console.log("playing front")
			Sound.playBlob(html.fields.frontSound)
		},
		recordBack: (html) => {
			html.fields.direction = "back"
			Mic.startRecording(() => {
			})
		},
		playBack: (html) => {
			console.log("playing back")
			Sound.playBlob(html.fields.backSound)
		},
		stopRecording: (html) => {
			Mic.stopRecording(blob => {
				if html.fields.direction == "front" {
					html.fields.frontSound = blob
					html.playFront.enable()
				}
				else if html.fields.direction == "back" {
					html.fields.backSound = blob
					html.playBack.enable()
				}
				else {
					throw new Error("x")
				}

				Sound.playBlob(blob)

				html.fields.direction = null
				if html.fields.frontSound && html.fields.backSound {
					html.save.enable()
				}
			})
		},
	},
}
