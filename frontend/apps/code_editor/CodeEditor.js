export function CodeEditor() {
	Permission.request()

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

	return {
		onStart: () => {
			Mic.start()
			console.log("Speech start detected")
		},
		onEnd: async () => {
			const blob = await Mic.stop()
			const text = await Transcribe(blob.toWav())

			const newCode = await Gpt(`
				- You are a helpful and intelligent voice-driven code editor
				- You are only editing a single file
				- you only respond with code, but without the triple tick markdown syntax.
				- I will use "git diff", so keep changes small.

				prompt:
					${text}

				code:
					${getCode()}
			`.dedent())

			renderCode(newCode)
		},
	}
}
