function button(text, position, onClick) {
	const div = Html.createElement('div', position, '')
	const b = Html.createElement('button', div, '')

	b.style.padding = '10px'
	b.style.margin = '5px'

	b.innerHTML = text
	b.value = text

	b.addEventListener('click', onClick)

	b.addEventListener('mouseover', () => {
		Mouse.hoveringHtmlElement = true
	});

	b.addEventListener('mouseout', () => {
		Mouse.hoveringHtmlElement = false
	});

	return b
}

function textField(text, position, onChange) {
	const div = Html.createElement('div', position, '')
	const b = Html.createElement('input', div, '')

	b.addEventListener('input', () => {
		onChange(b.value)
	})

	b.addEventListener('focusin', () => {
		console.log("on focus")
		Mouse.disabled = true
		Controller.disabled = true
	})

	b.addEventListener('focusout', () => {
		console.log("focus out")
		Mouse.disabled = false
		Controller.disabled = false
	})

	return b
	
}

export class Overlay {

	static leftButton(text, onClick) {
		return button(text, '.left', onClick)
	}

	static leftTextField(text, onChange) {
		return textField(text, '.left', onChange)
	}

	static bottomTextField(text, onChange) {
		return textField(text, '.bottom', onChange)
	}

	static rightButton(text, onClick) {
		return button(text, '.right', onClick)
	}

	static bottomButton(text, onClick) {
		return button(text, '.bottom', onClick)
	}

	static clearAll() {
		Html.removeChildElementsInId('top')
		Html.removeChildElementsInId('bottom')
		Html.removeChildElementsInId('left')
		Html.removeChildElementsInId('right')
	}

	static clearBottom() {
		Html.removeChildElementsInId('bottom')
	}

	static bottomImage(image, onClick) {
		const div = Html.createElement('div', '.bottom', 'item image')
		div.style.background = 'white'

		const i = Html.createElement('img', div, 'image')
		i.src = image
		i.style.maxWidth = '100%'

		div.addEventListener('click', onClick)
	}
}
