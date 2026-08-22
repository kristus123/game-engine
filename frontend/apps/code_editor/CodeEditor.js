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

		html.stop.onClick(() => {
			console.log("stopped")
			Mic.stop(async blob => {
				const text = await Transcribe(blob)
				console.log(text)

				Gpt(`
					- Only return code.
					- Do not include the triple-tick markdown syntax
					- Be as stupid as possible. your job is to just type what i say even if it leads to bugs.
					- It will be git diffed, so apply as little changes as possible

					prompt:
						${text}

					${getCode()}
				`)
					.then(output => {
						renderCode(output)
					})
			})
		})
	}

	update() {

	}
}
