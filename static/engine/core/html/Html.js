export class Html {
	static modal(children=[]) {
		return this.dialog(children)
	}

	static addToScreen(element) {
		document.getElementById('ui_elements').appendChild(element)
		return element
	}

	static upperLeft(elements) {
		return Html.addToScreen(
			Html.div('upper-left-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static upperRight(elements) {
		return Html.addToScreen(
			Html.div('upper-right-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static left(elements) {
		return Html.addToScreen(
			Html.div('left-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static right(elements) {
		return Html.addToScreen(
			Html.div('right-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static upper(elements) {
		return Html.addToScreen(
			Html.div('upper-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static lower(elements) {
		return Html.addToScreen(
			Html.div('lower-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}


	static center(elements) {
		return Html.addToScreen(
			Html.div('center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static centerList(elements) {
		return Html.addToScreen(
			Html.div('center-ui', [
				Html.div('', elements)
			]))
	}

	static fill(elements) {
		return Html.addToScreen(
			Html.div('fill-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static fillList(elements) {
		return Html.addToScreen(
			Html.div('fill-ui', [
				Html.div('', elements)
			]))
	}

	static lowerCenter(elements) {
		return Html.addToScreen(
			Html.div('lower-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static clearCenter() {
		document.querySelector('.center-ui').remove()
	  Mouse.hoveringHtmlElement = false
	}


	static clearLower() {
		document.querySelector('.lower-center-ui').remove()
	  Mouse.hoveringHtmlElement = false
	}


	static clear() {
		const elements = document.getElementById('ui_elements').querySelectorAll('*')

		for (const el of elements) {
			el.remove()
		}

	  Mouse.hoveringHtmlElement = false
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

	static p(text, className='na') {
		const p = HtmlElement('p', className)
		p.innerHTML = text

		return p
	}

	static img() {
		const img = HtmlElement('img', 'ui')
		img.src = 'https://play-lh.googleusercontent.com/7oW_TFaC5yllHJK8nhxHLQRCvGDE8jYIAc2SWljYpR6hQlFTkbA6lNvER1ZK-doQnQ'

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
			Sound.click()
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

		return e
	}
}
