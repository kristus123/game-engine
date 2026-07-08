export class OpenAiWorld {

	constructor() {
		MicPermission.request(() => {
		})

		const html = Dom.add(Html.translator())

		let language = "Chinese"
		let lastResult = null

		const startRecording = () => {
			Gp.vibrate()
			console.log("pressed left start record")
			html.h1.text("recording")
			Mic.start()
		}
		html.buttons.add(H.button("record", startRecording))
		Gp.left = startRecording

		const stopAndTranslate = () => {
			Gp.vibrate()
			html.h1.textContent = "CRUNCHING"
			Mic.stop(async blob => {
				const s = StopWatch().start()
				const transcribedText = await Transcribe(blob)
				const translatedText = await MyTranslate(transcribedText)
				console.log(s.ms)

				html.h1.text(transcribedText)
				lastResult = translatedText
				Tts(translatedText)
			})
		}

		html.buttons.add(H.button("stop and translate", stopAndTranslate))
		Gp.right = stopAndTranslate

		Gp.up = () => {
			if (lastResult) {
				Tts(lastResult)
			}
		}
	}

	update() {
	}
}
