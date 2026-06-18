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
			console.log("pressed right start record")
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
