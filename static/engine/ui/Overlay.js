export class Overlay {
	constructor(camera) {
		this.button = new Button('hahaha', camera)
		// new ImageSelectorProvider()
	}

	update() {
		this.button.update()
	}

	draw(draw, guiDraw) {
		this.button.draw(draw, guiDraw)
	}

	addTop(message) {
		const div = document.createElement('div')

		div.classList.add('item')
		div.innerHTML = message

		document.getElementsByClassName('header')[0].appendChild(div)
	}
}
