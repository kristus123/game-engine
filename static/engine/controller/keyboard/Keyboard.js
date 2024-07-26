document.addEventListener('keydown', function(event) {
	if (event.key === 'Tab' || event.keyCode === 9) {
		event.preventDefault()
	}
})


export class Keyboard {
	constructor() {
		document.addEventListener('keydown', (e) => {
			if (e.code === 'ArrowUp' || e.code === 'KeyW') {
				this.up = true
			}
			if (e.code === 'ArrowDown' || e.code === 'KeyS') {
				this.down = true
			}
			if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
				this.left = true
			}
			if (e.code === 'ArrowRight' || e.code === 'KeyD') {
				this.right = true
			}
			if (e.code === 'Space') {
				this.space = true
			}
			if (e.code === 'KeyE') {
				this.e = true
			}
			if (e.code === 'KeyF') {
				this.f = true
			}
		})

		document.addEventListener('keyup', (e) => {
			if (e.code === 'ArrowUp' || e.code === 'KeyW') {
				this.up = false
			}
			if (e.code === 'ArrowDown' || e.code === 'KeyS') {
				this.down = false
			}
			if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
				this.left = false
			}
			if (e.code === 'ArrowRight' || e.code === 'KeyD') {
				this.right = false
			}
			if (e.code === 'Space') {
				this.space = false
			}
			if (e.code === 'KeyE') {
				this.e = false
			}
			if (e.code === 'KeyF') {
				this.f = false
			}
		})
	}
}
