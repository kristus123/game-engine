export class OpenAiWorld {

	constructor() {
		const html = Dom.add(Html.translator)

		MicPermission.request(() => {
		})

		Gp.left = () => {
			console.log("pressed left start record")
			html.title.text("recording")
			Mic.start()
		}

		Gp.right = () => {
			html.title.text("transcribing")
			Mic.stop(async blob => {
				const transcribedText = await Transcribe(blob)
				html.title.text(transcribedText)

				const translatedText = await Gpt("Translate to chinese: " + transcribedText)
				html.title.text(translatedText)

				Sound.playBlob(await Ttv(translatedText))
			})
		}

	}

	update() {

	}
}
