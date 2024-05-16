export class HtmlUtils {

	static createElement(element, parent, className) {
		// check if parent argument is a "string" or HTMLelement
		const parentElement = parent instanceof HTMLElement ? parent : document.querySelector(parent)
		const newElement = document.createElement(element)

		newElement.className = className

		parentElement.appendChild(newElement)
		return newElement
	}

	static removeChildElementsInId(id) {
		var bottomDiv = document.getElementById(id)
		while (bottomDiv.firstChild) {
			bottomDiv.removeChild(bottomDiv.firstChild)
		}
	}

}
