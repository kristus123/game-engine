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

		Vad({
			onStart: () => {
				console.log("Speech start detected")
			},
			onEnd: async wav => {
				const text = await Transcribe(wav, 16_000)

				console.log(text)

				const newCode = await Gpt(`
					- Only return code, but without the triple tick markdown syntax.
					- I will use "git diff", so keep changes small.

					prompt:
						${text}

					code:
						${getCode()}
				`)
				renderCode(newCode)
			},
		})
	}

	update() {

	}

}
