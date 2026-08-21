function yoyo(div) {
	const range = document.createRange()
	const selection = window.getSelection()

	range.selectNodeContents(div)
	range.collapse(false)

	selection.removeAllRanges()
	selection.addRange(range)

	div.focus()

	return div
}

export class CodeEditor {

	constructor() {
		const html = Dom.add(Html.codeEditor())

		const x = () => {
			const y = `
				<code-line slot-line="1" slot-text="yolo"></code-line>
			`.toHtml()
			html.lines.add(y)

			y.addEventListener("keydown", event => {
				if (event.key == "ArrowDown") {
					yoyo(y.nextElementSibling)
					console.log(y.nextElementSibling)
				}
			})

			console.log(y)
			return y
		}

		x()
		x()
	}

	update() {

	}
}
