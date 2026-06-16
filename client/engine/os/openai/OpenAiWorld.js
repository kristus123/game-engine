export class OpenAiWorld {
	constructor() {
		Dom.add(H.button("start", () => {
			Mic.start()
		}))

		Dom.add(H.button("stop", () => {
			Mic.stop((b) => {
				Transcribe(b, (text) => {
					Gpt("Translate my text to chinese: " + text, r => {
						Ttv(r, b => {
							Sound.playBlob(b)
						})
					})
				})
			})

		}))
		MicPermission.request(() => {
		})

	}

	update() {

	}
}
