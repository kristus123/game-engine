export class OpenAiWorld {

	constructor() {
		MicPermission.request(() => {
		})

		const html = Dom.add(Html.translator())

		let lastResult = null

		const startRecording = () => {
		}

		const b1 = H.button("record", () => {
			if (Mic.idle) {
				Mic.start()
				b1.text("recording")
			}
			else if (Mic.recording) {
				Mic.stop(async blob => {
					b1.text("please wait")
					b1.disable()
					const translatedText = await MyTranslate(await Transcribe(blob))

					lastResult = translatedText
					Tts(translatedText)
					b1.enable()
					b1.text("press to record")
				})
			}
		}).css("max-height:400px;")

		html.buttons.add(b1)

		html.buttons.add(H.button("cancel", () => {
			Mic.stop(() => {
				b1.text("press to record")
				b1.enable()
			})
		}).css("max-height:40px;"))

		html.buttons.add(H.button("repeat", () => {
			if (lastResult) {
				Tts(lastResult)
			}
		}).css("max-height:40px;"))

	}

	update() {
	}
}
