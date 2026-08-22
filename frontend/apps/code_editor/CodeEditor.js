export function float32ToWav(audio, sampleRate = 16000) {
	const buffer = new ArrayBuffer(44 + audio.length * 2)
	const view = new DataView(buffer)

	const write = (offset, string) => {
		for (let i = 0; i < string.length; i++) {
			view.setUint8(offset + i, string.charCodeAt(i))
		}
	}

	write(0, "RIFF")
	view.setUint32(4, 36 + audio.length * 2, true)
	write(8, "WAVE")
	write(12, "fmt ")

	view.setUint32(16, 16, true)
	view.setUint16(20, 1, true)
	view.setUint16(22, 1, true)
	view.setUint32(24, sampleRate, true)
	view.setUint32(28, sampleRate * 2, true)
	view.setUint16(32, 2, true)
	view.setUint16(34, 16, true)

	write(36, "data")
	view.setUint32(40, audio.length * 2, true)

	for (let i = 0; i < audio.length; i++) {
		const sample = Math.max(-1, Math.min(1, audio[i]))
		view.setInt16(
			44 + i * 2,
			sample < 0 ? sample * 0x8000 : sample * 0x7fff,
			true
		)
	}

	return new Blob([buffer], { type: "audio/wav" })
}


















export class CodeEditor {

	constructor() {
		const html = Dom.add(Html.codeEditor())

		function renderCode(text) {
			html.lines.clearChildren()
			for (const [i, line] of text.split("\n").entries()) {
				html.lines.add(H.create("code-line", { "slot-line": i+1, "slot-text": line }))
			}
		}

		function getCode() {
			let code = ""
			for (const [i, line] of [...html.lines.children].entries()) {
				code += line.getId("code").textContent + "\n"
			}
			return code
		}

		renderCode(TestFile)

		Mic.request(() => {
		})

		html.start.onClick(() => {
			console.log("started")
			Mic.start()
		})


		vad.MicVAD.new({
			onSpeechStart: () => {
				console.log("Speech start detected")
			},
			onSpeechEnd: async (audio) => { // do something with `audio` (Float32Array of audio samples at sample rate 16000)...
				const text = await Transcribe(float32ToWav(audio))
				console.log(text)

				const x = await Gpt(`
					- Only return code, but without the triple-tick markdown syntax.
					- I will use "git diff", so apply as little changes as possible

					prompt:
						${text}

					code:
						${getCode()}
				`)
				renderCode(x)

			},
			onnxWASMBasePath: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
			baseAssetPath: "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",
		}).then(x => x.start())

	}

	update() {

	}
}
