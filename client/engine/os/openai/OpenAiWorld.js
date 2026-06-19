export class OpenAiWorld {

	constructor() {
		MicPermission.request(() => {
		})

		const html = Dom.add(Html.translator())

		let language = "Chinese"

		for (const lang of ["Chinese", "Japanese", "Korean", "Vietnamese", "Thailand"]) {
			html.languages.add(H.button(lang, () => {
				language = lang
			}))
		}

		html.buttons.add(H.button("record", () => {
			Vibrate(50)

			console.log("pressed left start record")
			html.h1.text("recording")
			Mic.start()
		}))
		Gp.left = () => {
		}

		html.buttons.add(H.button("stop", () => {
			Vibrate(200)

			html.h1.textContent = "transciribng"
			Mic.stop(async blob => {
				// const transcribedText = await Transcribe(blob)
				// html.h1.text(transcribedText)

				// const translatedText = await Gpt(`Translate to ${language}: ${transcribedText}`)
				// html.h1.text(translatedText)

				// Sound.playBlob(await Ttv(translatedText, `Speak in ${language}`))
				TestTranscribe(translatedText, t => {
					Tts(t)
				})
			})
			
		}))
		Gp.right = () => {
		}

	}

	update() {
	}
}
