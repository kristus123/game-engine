document.addEventListener('keydown', e => {
	if (e.key === 'Tab' || e.keyCode === 9) { // what is 9 ?
		e.preventDefault()
	}
})


export class Keyboard {

	static disabled = false

	static noButtonsPressed() {
		return !this.up && !this.down && !this.left && !this.right
	}

	static {
		document.addEventListener('keydown', (e) => {
			if (this.disabled) {

			}
			else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
				this.up = true
			}
			else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
				this.down = true
			}
			else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
				this.left = true
			}
			else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
				this.right = true
			}
			else if (e.code === 'Space') {
				this.space = true
			}
			else if (e.code === 'KeyE') {
				this.e = true
			}
			else if (e.code === 'KeyF') {
				this.f = true
			}
			else if (e.code === 'KeyQ') {
				this.q = true
			}
			else if (e.code === 'KeyR') {
				this.r = true
			}
		})

		document.addEventListener('keyup', (e) => {
			if (e.code === 'ArrowUp' || e.code === 'KeyW') {
				this.up = false
			}
			else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
				this.down = false
			}
			else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
				this.left = false
			}
			else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
				this.right = false
			}
			else if (e.code === 'Space') {
				this.space = false
			}
			else if (e.code === 'KeyE') {
				this.e = false
			}
			else if (e.code === 'KeyF') {
				this.f = false
			}
			else if (e.code === 'KeyQ') {
				this.q = false
			}
			else if (e.code === 'KeyR') {
				this.r = false
			}
		})
	}
}
