function element(type, clazz) {
	const e = document.createElement(type)
	e.setAttribute('class', clazz)
	e.setAttribute('tabindex', -1)

	e.addEventListener('mousedown', e => {
		e.preventDefault()
	})

	return e
}

function addToScreen(element) {
	document.getElementById('ui_elements').appendChild(element)
}

export class Html {

	static p(text) {
		var p = document.createElement('p')
		p.innerHTML = text

		return p
	}

	static addToScreen(element) {
		document.getElementById('ui_elements').appendChild(element)
	}

	static button(text, onClick=() => {}) {
		const button = element('button', 'button')
		button.textContent = text

		button.addEventListener('click', () => {
			onClick(button)
		})

		// addToScreen(button)

		return button
	}

	static ui(elements) {
		const div = element('div', 'ui')
		for (const e of elements) {
			e.setAttribute('class', 'button')
			div.appendChild(e)
		}

		addToScreen(div)

		return div
	}

	static text(text, position) {
		const p = element('p', 'ui')
		p.textContent = text
		p.style.fontSize = '100px'

		// p.style.left = `${position.x}px`
		// p.style.top = `${position.y}px`

		addToScreen(p)

		return p
		// return {
		// 	style: p.style,
		// 	text: text => {
		// 		p.textContent = text
		// 		return this
		// 	},
		// 	position: position => {
		// 		p.style.left = `${position.x}px`
		// 		p.style.top = `${position.y}px`
		// 		return this
		// 	}
		// }
	}

	static remove(e) {
		e.parentNode.removeChild(e)
	}

	static removeChildElementsInId(id) {
		const div = document.getElementById(id)
		while (div.firstChild) {
			div.removeChild(div.firstChild)
		}
	}

	static div(className, childrenElements=[]) {
		const d =  document.createElement('div')

		d.classList.add(className);

		for (const e of childrenElements) {
			d.appendChild(e)
		}

		return d
	}

}
