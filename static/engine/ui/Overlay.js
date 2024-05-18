export class Overlay {
	constructor(camera) {
	}

	update() {
	}

	draw(draw, guiDraw) {
	}

	static leftButton(text, onClick) {
			const div = HtmlUtils.createElement('div', '.left', '')
			const b = HtmlUtils.createElement('button', div, '')

			b.style.padding = '10px'
			b.style.margin = '5px'

			b.innerHTML = text
			b.value = text

			b.addEventListener('click', onClick)
	}

	static rightButton(text, onClick) {
			const div = HtmlUtils.createElement('div', '.right', '')
			const b = HtmlUtils.createElement('button', div, '')

			b.style.padding = '10px'
			b.style.margin = '5px'

			b.innerHTML = text
			b.value = text

			b.addEventListener('click', onClick)
	}


	static bottomButton(text, onClick) {
			const div = HtmlUtils.createElement('div', '.bottom', '')
			const b = HtmlUtils.createElement('button', div, '')

			b.style.padding = '10px'
			b.style.margin = '5px'

			b.innerHTML = text
			b.value = text

			b.addEventListener('click', onClick)
	}

	static clearBottom() {
		HtmlUtils.removeChildElementsInId('bottom')
	}

	static bottomImage(image, onClick) {
		const div = HtmlUtils.createElement('div', '.bottom', 'item image')
		div.style.background = 'white'

		const i = HtmlUtils.createElement('img', div, 'image')
		i.src = image
		i.style.maxWidth = '100%'

		i.addEventListener('click', onClick)
	}
}
