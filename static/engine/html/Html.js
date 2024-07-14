function element(type, clazz) {
	const e = document.createElement(type)
	e.setAttribute('class', clazz)
	e.setAttribute('tabindex', -1)

	e.addEventListener('mousedown', e => {
		e.preventDefault()
	})

	return e
}

export class Html {

	static p(text) {
		var p = document.createElement('p')
		p.innerHTML = text

		return p
	}

	static button(text, onClick) {
		const button = element('button', 'ui button')
		button.textContent = text

		button.addEventListener('click', () => {
			onClick(button)
		})

		document.getElementById('ui_elements').appendChild(button)

		return button
	}

	static text(text, position) {
		const p = element('p', 'ui')
		p.textContent = text
		p.style.fontSize = '100px'

		p.style.left = `${position.x}px`
		p.style.top = `${position.y}px`

		document.getElementById('ui_elements').appendChild(p)

		return {
			style: p.style,
			text: text => {
				p.textContent = text
				return this
			},
			position: position => {
				p.style.left = `${position.x}px`
				p.style.top = `${position.y}px`
				return this
			}
		}
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
}
