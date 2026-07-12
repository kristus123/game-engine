export function HtmlElement(type, className="na") {
	const e = document.createElement(type)
	e.setAttribute("class", className)
	return e
}
