export class OpenAiWorld {

	constructor() {
		Dom.add(H.button("start", () => {
			Mic.start()
		}))

		Dom.add(H.button("stop", () => {
			Mic.stop(async b => {
				const transcribedText = await Transcribe(b)

				const gptText = await Gpt("Translate to chinese: " + transcribedText)

				Sound.playBlob(await Ttv(gptText))
			})
		}))

		MicPermission.request(() => {
		})

	}

	update() {

	}
}
