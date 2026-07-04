let localTranslator = null
async function localTranslate(text) {
	return await localTranslator.translate(text)
}

export class OpenAiWorld {

	constructor() {
		MicPermission.request(() => {
		})

		const html = Dom.add(Html.translator())

		html.buttons.add(H.button("download", async () => {
			localTranslator = await Translator.create({
				sourceLanguage: "en",
				targetLanguage: "zh",
			})
		}))

		let language = "Chinese"

		const startRecording = () => {
			console.log("pressed left start record")
			html.h1.text("recording")
			Mic.start()
		}
		html.buttons.add(H.button("record", startRecording))
		Gp.left = startRecording

		const stopAndTranslate = () => {
			html.h1.textContent = "transciribng"
			Mic.stop(async blob => {
				const transcribedText = await Transcribe(blob)
				const translatedText = await Gpt(`Translate to ${language}: ${transcribedText}`)

				html.h1.text(transcribedText)
				Tts(translatedText)
			})
		}

		html.buttons.add(H.button("stop and translate", stopAndTranslate))
		Gp.right = stopAndTranslate

		const stopAndPrompt = () => {
			html.h1.textContent = "transciribng"
			Mic.stop(async blob => {
				const transcribedText = await Transcribe(blob)
				const result = await Gpt(`${transcribedText}. reply in ${language}`)
				html.h1.text(result)
				Tts(result)
			})
		}

		html.buttons.add(H.button("stop and prompt", stopAndPrompt))
		Gp.down = stopAndPrompt
	}

	update() {
	}
}
