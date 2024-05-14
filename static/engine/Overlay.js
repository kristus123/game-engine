export class Overlay {
	static create(camera) {
		this.button = new Button('hahaha', camera)
	}

	static update(camera) {
		this.button.update()
	}

	static addTop(message) {
		const div = document.createElement('div')

		div.classList.add('item')
		div.innerHTML = message

		document.getElementsByClassName('header')[0].appendChild(div)
	}
}
