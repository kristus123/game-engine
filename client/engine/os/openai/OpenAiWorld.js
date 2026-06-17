export class OpenAiWorld {

	constructor() {
		Dom.add(H.button("start", () => {
			Mic.start()
		}))

		Dom.add(H.button("stop", () => {
			Mic.stop(async blob => {
				const transcribedText = await Transcribe(blob)

				const gptText = await Gpt("Translate to chinese: " + transcribedText)

				Sound.playBlob(await Ttv(gptText))
			})
		}))

		MicPermission.request(() => {
		})

		Gp.left = () => {
			console.log("clicked left")
		}

	}

	update() {

	}
}
