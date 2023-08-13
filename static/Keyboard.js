class Keyboard {
	constructor() {
		document.addEventListener('keydown', (e) => {
			if (e.code === 'ArrowUp') {
				this.up = true
			}
			if (e.code === 'ArrowDown') {
				this.down = true
			}
			if (e.code === 'ArrowLeft') {
				this.left = true
			}
			if (e.code === 'ArrowRight') {
				this.right = true
			}
			if (e.code === 'Space') {
				this.space = true
			}
		})

		document.addEventListener('keyup', (e) => {
			if (e.code === 'ArrowUp') {
				this.up = false
			}
			if (e.code === 'ArrowDown') {
				this.down = false
			}
			if (e.code === 'ArrowLeft') {
				this.left = false
			}
			if (e.code === 'ArrowRight') {
				this.right = false
			}
			if (e.code === 'Space') {
				this.space = false
			}
		})

	}

	onClick(run) {
		document.addEventListener('click', (e) => {
			run(e.clientX, e.clientY)
		})
	}
}
