export class HtmlUtils {

	static image() {
		
	}

	static createElement(element, parent, className) {
		// check if parent argument is a "string" or HTMLelement
		const parentElement = parent instanceof HTMLElement ? parent : document.querySelector(parent)
		const newElement = document.createElement(element)

		newElement.className = className

		parentElement.appendChild(newElement)
		return newElement
	}

	// remove html elements
	static removeElements(className) {

		const elements = document.querySelectorAll(`${className}`)

		elements.forEach((element) => {
			element.remove()
		})
	}
}
