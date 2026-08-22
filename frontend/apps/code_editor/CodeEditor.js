export class CodeEditor {

	constructor() {
		const html = Dom.add(Html.codeEditor())

		const file = `
			if true:
				print yes
			else:
				print no

			throw an error here
		`.dedent()

		Gpt(`
			- Only return code.

			Here is some code. can you turn it into python.

			${file}
		`.dedent())
			.then(x => {
				for (const [i, line] of x.split("\n").entries()) {
					html.lines.add(H.create("code-line", { "slot-line": i+1, "slot-text": line }))
				}
			})
	}

	update() {

	}
}
