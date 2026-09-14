export function CodeEditor() {
	Permission.request()

	const html = Dom.add(H.create("code-editor"))

	function renderCode(text) {
		html.lines.clearChildren()
		for (const [i, line] of text.split("\n").entries()) {
			html.lines.add(H.create("code-line", {
				slots: {
					line: i+1, text: line,
				} }
			))
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
	console.log(getCode())


	html.mic.onClick(async () => {
		if (Mic.recording) {
			html.mic.content = "Start"
			const blob = await Mic.stop()
			console.log(await blob)
			const text = await Transcribe(blob.toWav())

			console.log(getCode())
			const newCode = await Gpt(`
				- You are a helpful and intelligent voice-driven code editor
				- You are only editing a single file
				- you only respond with code, but without the triple tick markdown syntax.
				- I will use "git diff", so keep changes small.

				prompt:
					${text}

				code:
					${getCode()}
			`) // .dedent() is buggy so currently not using it

			console.log(newCode)

			renderCode(newCode)
		}
		else {
			Mic.start()
			html.mic.content = "Stop"
		}

	})
}
