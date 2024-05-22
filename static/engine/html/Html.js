function element(type, clazz) {
	const e = document.createElement(type)
	e.setAttribute('class', clazz)
	e.setAttribute('tabindex', -1)

	// document.getElementById('ui_elements').appendChild(e)

	e.addEventListener('mousedown', e => {
		e.preventDefault()
	})

	return e
}

export class Html {

	static button(text, onClick) {
		const button = element('button', 'ui button')
		button.textContent = text

		button.addEventListener('click', () => {
			onClick(button)
		})

		document.getElementById('ui_elements').appendChild(button)
		return button
	}

	static text(text) {
		const div = element('div', 'ui')
		div.style.padding = '106px'
		div.style.margin = '67px'

		const p = element('p', 'ui')
		p.textContent = text
		p.style.fontSize = '100px'
		div.appendChild(p)

		document.getElementById('ui_elements').appendChild(div)
	}

	static remove(e) {
		e.parentNode.removeChild(e)
	}

	static removeChildElementsInId(id) {
		var bottomDiv = document.getElementById(id)
		while (bottomDiv.firstChild) {
			bottomDiv.removeChild(bottomDiv.firstChild)
		}
	}

	static createElement(element, parent, className) {
		// check if parent argument is a "string" or HTMLelement
		const parentElement = parent instanceof HTMLElement ? parent : document.querySelector(parent)
		const newElement = document.createElement(element)

		newElement.className = className

		parentElement.appendChild(newElement)
		return newElement
	}

}
