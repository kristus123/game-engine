export class Html {
	static modal(children=[]) {
		return this.dialog(children)
	}

	static upper(elements) {
		Html.addToScreen(
			Html.div('upper-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static lower(elements) {
		Html.addToScreen(
			Html.div('lower-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}


	static center(elements) {
		Html.addToScreen(
			Html.div('center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static lowerCenter(elements) {
		Html.addToScreen(
			Html.div('lower-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static clearCenter() {
		document.querySelector('.center-ui').remove()
	}

	static dialog(children=[]) {

		const div = HtmlElement('div')
		for (const c of children) {
			div.appendChild(c)
		}

		const d = HtmlElement('dialog')
		d.appendChild(div)

		d.addEventListener('click', e => {
			if (e.target === d) {
			  d.close() // close modal if clicking outside of it
			}
		  })

		d.showModal()

		return d
	}

	static slider(min=1, max=100) {
		const s = HtmlElement('input')

		s.type = 'range'
		s.min = min
		s.max = max
		s.value = 0
		s.step=1

		s.addEventListener('mouseover', () => {
			Mouse.hoveringHtmlElement = true
		})

		s.addEventListener('mouseout', () => {
			Mouse.hoveringHtmlElement = false
		})

		return s
	}


	static input(placeholder='placehodlert', onEnter=(value) => {}) {
		const i = HtmlElement('input')
		 i.type = 'text'
		i.placeholder = placeholder


		  i.addEventListener('focus', () => {
			// console.log('Input is highlighted!');
			Controller.disabled = true
			i.style.borderColor = '#6c63ff' // change border color on highlight
		  })

		  i.addEventListener('blur', () => {
			Controller.disabled = false
			// console.log('Input is no longer highlighted.');
			i.style.borderColor = '#ccc' // revert border color
		  })


		i.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				console.log('hei')
				onEnter(i.value)
			}
		})


		return i
	}


	static focus(element) {
	  if (element) {
		element.focus();
	  }
	}


	static focusInput() {
		const input = document.querySelector('input[type="text"]');
		if (input) input.focus();
	}


	static h1(text, className='na') {
		const h1 = HtmlElement('h1', className)
		h1.innerHTML = text

		return h1
	}

	static p(text, className='na') {
		const p = HtmlElement('p', className)
		p.innerHTML = text

		return p
	}

	static addToScreen(element) {
		element.classList.add('ui')
		document.getElementById('ui_elements').appendChild(element)
		return element
	}

	static button(text, onClick= b => {}) {
		const button = HtmlElement('button', 'button')
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
		const div = HtmlElement('div', 'ui')
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

		const p = HtmlElement('p', '')
		p.textContent = text
		p.style.fontSize = '2vw'

		position = Camera.p(position) // todo imrpoveo ofc
		p.style.left = `${position.x}px`
		p.style.top = `${position.y}px`

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
		const d = HtmlElement('div', className)

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

	static appendBody(childrenElements=[]) {
		this.append(document.body, childrenElements)
	}

	static fadeaway(text, position=Mouse.position) {
		position = Camera.p(position) // todo imrpoveo ofc

		var textElement = HtmlElement('p')
		textElement.innerHTML = text


		textElement.setAttribute('class', 'ui fade-away')

		textElement.style.left = `${position.x}px`
		textElement.style.top = `${position.y - 50}px`

		Html.addToScreen(textElement)

		setTimeout(() => {
			Html.remove(textElement)
		}, 1000)
	}

	static floating(e, position) {
		position = Camera.p(position) // todo imrpoveo ofc

		e.classList.add('ui')

		e.style.left = `${position.x}px`
		e.style.top = `${position.y - 50}px`

		Html.addToScreen(e)

		return e
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
