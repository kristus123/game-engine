export class OpenAiWorld {

	constructor() {
		const html = Dom.add(Html.translator())

		let language = "Chinese"

		html.languages.add(H.button("Chinese", () => {
			language = "Chinese"
		}))

		html.languages.add(H.button("Japanese", () => {
			language = "Japanese"
		}))

		html.languages.add(H.button("Korean", () => {
			language = "Korean"
		}))

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

				const translatedText = await Gpt(`Translate to ${language}: ${transcribedText}`)
				html.h1.text(translatedText)

				Sound.playBlob(await Ttv(translatedText, `Speak in ${language}`))
			})
		}

	}

	update() {
	}
}
