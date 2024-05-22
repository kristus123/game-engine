export class Overlay {
	constructor(camera) {
	}

	update() {
	}

	draw(draw, guiDraw) {
	}

	static leftButton(text, onClick) {
		const div = Html.createElement('div', '.left', '')
		const b = Html.createElement('button', div, '')

		b.style.padding = '10px'
		b.style.margin = '5px'

		b.innerHTML = text
		b.value = text

		b.addEventListener('click', onClick)
	}

	static rightButton(text, onClick) {
		const div = Html.createElement('div', '.right', '')
		const b = Html.createElement('button', div, '')

		b.style.padding = '10px'
		b.style.margin = '5px'

		b.innerHTML = text
		b.value = text

		b.addEventListener('click', onClick)
	}


	static bottomButton(text, onClick) {
		const div = Html.createElement('div', '.bottom', 'item')
		const b = Html.createElement('button', div, '')

		b.style.padding = '10px'
		b.style.margin = '5px'

		b.innerHTML = text
		b.value = text

		b.addEventListener('click', onClick)
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
