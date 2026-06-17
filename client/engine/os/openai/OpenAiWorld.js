export class OpenAiWorld {

	constructor() {
		MicPermission.request(() => {
		})

		Gp.left = () => {
			console.log("pressed left")
			Mic.start()
		}

		Gp.right = () => {
			console.log("pressed right")
			Mic.stop(async blob => {
				const transcribedText = await Transcribe(blob)

				const gptText = await Gpt("Translate to chinese: " + transcribedText)

				Sound.playBlob(await Ttv(gptText))
			})
		}

	}

	update() {

	}
}
