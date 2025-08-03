import { Controller } from '/static/engine/controller/Controller.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Button } from '/static/engine/graphics/ui/Button.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 

function createElement(element, parent, className) {
	// check if parent argument is a "string" or HTMLelement
	const parentElement = parent instanceof HTMLElement ? parent : document.querySelector(parent)
	const newElement = document.createElement(element)

	newElement.className = className

	parentElement.appendChild(newElement)
	return newElement
}

function button(text, position, onClick) {

	const div = createElement('div', position, '')
	const b = createElement('button', div, '')

	b.style.padding = '10px'
	b.style.margin = '5px'

	b.innerHTML = text
	b.value = text

	b.addEventListener('click', onClick)

	b.addEventListener('mouseover', () => {
		Mouse.hoveringHtmlElement = true
	})

	b.addEventListener('mouseout', () => {
		Mouse.hoveringHtmlElement = false
	})

	return b
}

function textField(text, position, onChange) {
	const div = createElement('div', position, '')
	const b = createElement('input', div, '')

	b.addEventListener('input', () => {
		onChange(b.value)
	})

	b.addEventListener('focusin', () => {
		console.log('on focus')
		Mouse.disabled = true
		Controller.disabled = true
	})

	b.addEventListener('focusout', () => {
		console.log('focus out')
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
		const div = createElement('div', '.bottom', 'item image')
		div.style.background = 'white'

		const i = createElement('img', div, 'image')
		i.src = image
		i.style.maxWidth = '100%'

		div.addEventListener('click', onClick)
	}
}
