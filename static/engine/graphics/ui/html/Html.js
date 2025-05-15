function element(type, clazz) {
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

	document.getElementById('ui_elements').appendChild(e)

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

	static slider(min=1, max=100) {
		const x = element('input')

		x.type = 'range'
		x.min = min
		x.max = max
		x.value = 0
		x.step=1

		x.addEventListener('mouseover', () => {
			Mouse.hoveringHtmlElement = true
		})

		x.addEventListener('mouseout', () => {
			Mouse.hoveringHtmlElement = false
		})

		return x
	}

	static p(text, className='na') {
		var p = element('p', className)
		p.innerHTML = text

		return p
	}

	static addToScreen(element) {
		document.getElementById('ui_elements').appendChild(element)
		return element
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

	static show(e) {
		e.style.display = 'block' // Show
	}

	static hide(e) {
		e.style.display = 'none' // Hide
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

	static removeChildElements(div) {
		while (div.firstChild) {
			div.removeChild(div.firstChild)
		}
	}

	static removeChildElementsInId(id) {
		const div = document.getElementById(id)
		while (div.firstChild) {
			div.removeChild(div.firstChild)
		}
	}

	static div(className, childrenElements=[]) {
		const d = element('div', className)

		for (const e of childrenElements) {
			d.appendChild(e)
		}

		return d
	}

	static append(element, childrenElements=[]) {
		for (const e of childrenElements) {
			element.appendChild(e)
		}
	}

	static fadeaway(text, position=Mouse.position) {
		position = Camera.p(position) // todo imrpoveo ofc

		var textElement = element('p')
		textElement.innerHTML = text


		textElement.setAttribute('class', 'ui fade-away')

		textElement.style.left = `${position.x}px`
		textElement.style.top = `${position.y - 50}px`

		Html.addToScreen(textElement)

		setTimeout(() => {
			Html.remove(textElement)
		}, 1000)
	}

	static floating(htmlElement, position) {
		position = Camera.p(position) // todo imrpoveo ofc

		htmlElement.classList.add('ui')

		htmlElement.style.left = `${position.x}px`
		htmlElement.style.top = `${position.y - 50}px`

		Html.addToScreen(htmlElement)

		return htmlElement
	}

	static floatingPosition(e, position) {
		position = Camera.p(position) // todo imrpoveo ofc
		e.style.left = `${position.x}px`
		e.style.top = `${position.y - 50}px`
	}

	static dropDown(menu, sub_menus) {
		const subMenu = Html.div(menu.className, sub_menus)
		subMenu.className = 'sub-menu'
		subMenu.addEventListener('mouseover', () => {
			Html.show(subMenu)
		})
		menu.style.position = 'relative'
		menu.addEventListener('mouseout', () => {
			Html.hide(subMenu)
		})
		menu.addEventListener('mouseover', () => {
			Html.show(subMenu)
		})
		Html.hide(subMenu)
		menu.appendChild(subMenu)
		return menu
	}

}
