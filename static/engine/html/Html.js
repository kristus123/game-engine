export class Html {

	static button(text, onClick) {
		const button =  Html.element('button',  'ui button')
		button.textContent = text

		button.addEventListener('click', () => {
			onClick(button)
		})

		return button
	}

	static element(type, clazz) {
		const e = document.createElement(type)
		e.setAttribute('class', clazz)
		e.setAttribute('tabindex', -1)

		document.getElementById('ui_elements').appendChild(e)

		e.addEventListener('mousedown', e => {
			e.preventDefault()
		})

		return e
	}

	static remove(e) {
		e.parentNode.removeChild(e)
	}
}
