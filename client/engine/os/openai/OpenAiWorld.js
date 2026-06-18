export class OpenAiWorld {

	constructor() {
		const html = Dom.add(Html.translator())

		MicPermission.request(() => {
		})

		Gp.left = () => {
			console.log("pressed left start record")
			html.h1.text("recording")
			Mic.start()
		}

		Gp.right = () => {
			html.h1.textContent = "transciribng"
			Mic.stop(async blob => {
				const transcribedText = await Transcribe(blob)
				html.h1.text(transcribedText)

				const translatedText = await Gpt("Translate to chinese: " + transcribedText)
				html.h1.text(translatedText)

				Sound.playBlob(await Ttv(translatedText))
			})
		}

	}

	update() {

	}
}
