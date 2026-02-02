export class Html {
	static modal(children=[]) {
		return this.dialog(children)
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


	static input(placeholder='placeholder', onEnter=(value) => {}) {
		const i = HtmlElement('input')
		 i.type = 'text'
		i.placeholder = placeholder


		  i.addEventListener('focus', () => {
			Controller.disabled = true
			Keyboard.disabled = true
		  })

		  i.addEventListener('blur', () => {
			Controller.disabled = false
			Keyboard.disabled = false
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
		element.focus()
	}

	static focusInput() {
		const input = document.querySelector('input[type="text"]')
		if (input) {
			input.focus()
		}
	}


	static h1(text, className='na') {
		const h1 = HtmlElement('h1', className)
		h1.innerHTML = text

		return h1
	}

	static link(text, url, className='na') {
		const a = HtmlElement('a', className)
		a.href = url
		a.textContent = text
		a.target = '_blank'   // Open A New Tab
		a.rel = 'noopener'

		return a
	}

	static p(text, className='na') {
		const p = HtmlElement('p', className)
		p.innerHTML = text

		return p
	}

	static image(x) {
		const img = HtmlElement('img', '')
		img.src = x
		return img
	}


	static onClick(e, run) {
		e.addEventListener('click', () => {
			run()
		})

		return e
	}

	static button(text, onClick= b => {}) {
		const button = HtmlElement('button', 'button')
		button.textContent = text

		button.addEventListener('click', () => {
			onClick(button)

			  if (navigator.vibrate) {
				navigator.vibrate(50)
			  }

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

	static show(e) {
		e.style.display = 'block'
	}

	static hide(e) {
		e.style.display = 'none'
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
	}

	static remove(e) {
		e.parentNode.removeChild(e)
	  Mouse.hoveringHtmlElement = false
	}

	static removeChildElements(div) {
		while (div.firstChild) {
			div.removeChild(div.firstChild)
		}
	  Mouse.hoveringHtmlElement = false
	}

	static removeChildElementsInId(id) {
		const div = document.getElementById(id)
		while (div.firstChild) {
			div.removeChild(div.firstChild)
		}
	  Mouse.hoveringHtmlElement = false
	}

	static div(className, childElements=[]) {
		childElements = Always.list(childElements)

		const d = HtmlElement('div', className)

		for (const e of childElements) {
			console.log(e)
			d.appendChild(e)
		}

		return d
	}

	static append(element, childrenElements=[]) {
		for (const e of Always.list(childrenElements)) {
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

		return e
	}
}
