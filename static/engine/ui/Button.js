export class Button {
	constructor(text, camera) { //add position and make a border around and make it extend dybnamigcameobject

		this.button = document.createElement('button')
		this.button.textContent = text

		const attributes = { tabindex: -1, class: 'ui button', id: 'myButton' }
		Object.entries(attributes).forEach(([key, value]) => {
			this.button.setAttribute(key, value)
		})

		document.getElementById('buttons').appendChild(this.button)

		this.button.addEventListener('click', () => {
			this.button.innerText = 'xxx'
			this.removeFromScreen()
		})

		this.button.addEventListener('mousedown', e => {
			e.preventDefault()
		})
	}

	removeFromScreen() {
		this.button.parentNode.removeChild(this.button)
	}

	update() {
		const offsetX = 0 - this.camera.position.x + (Palette.width/2)
		const offsetY = 0 - this.camera.position.y + (Palette.height/2)

		this.button.style.left = `${offsetX}px`
		this.button.style.top = `${offsetY}px`
		// button.style.transform = `translate(${offsetX}px, ${offsetY}px)`
	}

	draw(draw, guiDraw) {
	}
}
