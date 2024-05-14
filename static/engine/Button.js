export class Button {
	constructor(text, camera) {

	  const button = document.createElement('button')
	  button.textContent = text
		this.button = button

		const attributes = { tabindex: -1, class: 'button', id: 'myButton' }
	  Object.entries(attributes).forEach(([key, value]) => {
			button.setAttribute(key, value)
	  })

		const buttons = document.getElementById('buttons')
		buttons.appendChild(button)

	   button.addEventListener('click', () => {
	   button.innerText = 'xxx'
		 button.parentNode.removeChild(button)
	   })

		this.button.addEventListener('mousedown', e => {
			e.preventDefault()
		})
	}

	removeFromScreen() {
		this.button.parentNode.removeChild(button)
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
