import { Mouse } from '/static/engine/controller/Mouse.js'; 

export function HtmlElement(type, clazz) {
	const e = document.createElement(type)
	e.setAttribute('class', clazz)
	e.setAttribute('tabindex', -1)

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
