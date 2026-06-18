export class OpenAiWorld {

	constructor() {
		MicPermission.request(() => {
		})

		Gp.left = () => {
			console.log("pressed left start record")
			Toast("Start")
			Mic.start()
		}

		Gp.right = () => {
			Toast("Stop")
			Mic.stop(async blob => {
				const transcribedText = await Transcribe(blob)
				Toast(transcribedText)

				const translatedText = await Gpt("Translate to chinese: " + transcribedText)
				Toast(translatedText)

				Sound.playBlob(await Ttv(translatedText))
			})
		}

	}

	update() {

	}
}
