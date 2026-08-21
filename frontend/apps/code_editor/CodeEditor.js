export class CodeEditor {

	constructor() {
		const html = Dom.add(Html.codeEditor())

		const x = `
			<code-line>
				<slot name="line">1</slot>
				<slot name="text">hello</slot>
			</code-line>
		`
		html.lines.add(x)
		html.lines.add(x)
		html.lines.add(x)


	}

	update() {

	}
}
