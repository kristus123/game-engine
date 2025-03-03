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
	static modal(children) {
		return this.dialog(children)
	}

	static dialog(children) {
		const div = element('div')
		const dialog = element('dialog')

		for (const x of children) {
			div.appendChild(x)
		}

		dialog.appendChild(div)

		dialog.addEventListener('click', e => {
			if (e.target === dialog) {
			  dialog.close() // close modal if clicking outside of it
			}
		  })

		return dialog
	}

	static p(text) {
		var p = element('p')
		p.innerHTML = text

		return p
	}

	static addToScreen(element) {
		document.getElementById('ui_elements').appendChild(element)
	}

	static button(text, onClick= b => {}) {
		const button = element('button', 'button')
		button.textContent = text

		button.addEventListener('click', () => {
			onClick(button)
		})

		button.addEventListener('mouseover', () => {
			Mouse.hoveringHtmlElement = true
		})

		button.addEventListener('mouseout', () => {
			Mouse.hoveringHtmlElement = false
		})

		return button
	}

	static disable(e) {
		if (!e.disabled) {
			e.disabled = true
		}
	}

	static enable(e) {
		if (e.disabled) {
			e.disabled = false
		}
	}

	static disableFor(ms, e) {
		e.disabled = true

		setTimeout(() => {
			e.disabled = false
		}, ms)
	}

	static ui(elements) {
		const div = element('div', 'ui')
		for (const e of elements) {
			// e.setAttribute('class', 'button')
			div.appendChild(e)
		}

		this.addToScreen(div)

		return div
	}

	static changeText(element, text) {
		element.textContent = text
	}

	static text(text, position) {
		const p = element('p', '')
		p.textContent = text
		p.style.fontSize = '2vw'

		p.style.left = `${100}px`
		p.style.top = `${100}px`

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
		const d = document.createElement('div')

		d.classList.add(className)

		for (const e of childrenElements) {
			d.appendChild(e)
		}

		return d
	}

	static fadeaway(x, position=Mouse.screenPosition) {
		var text = element('p')
		text.innerHTML = x


		text.setAttribute('class', 'ui fade-away')

		text.style.left = `${position.x}px`
		text.style.top = `${position.y - 50}px`

		Html.addToScreen(text)

		setTimeout(() => {
			Html.remove(text)
		}, 1000)
	}

}
