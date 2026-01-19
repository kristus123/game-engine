export function HtmlElement(type, className) {
	const e = document.createElement(type)
	e.setAttribute('class', className)

	// e.addEventListener('mousedown', e => {
	// 	e.preventDefault()
	// })

	e.addEventListener('mouseover', () => {
		Mouse.hoveringHtmlElement = true
	})

	e.addEventListener('mouseout', () => {
		Mouse.hoveringHtmlElement = false
	})

	return e
}
