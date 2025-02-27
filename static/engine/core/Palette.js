export class Palette {
	static width = window.innerWidth
	static height = window.innerHeight

	static createdCanvases = []
	static onResize = []

	static {
		let debounceTimeout
		window.addEventListener('resize', () => {
			clearTimeout(debounceTimeout)

			debounceTimeout = setTimeout(function() {
				console.log(`Window resized to: ${window.innerWidth} x ${window.innerHeight}`)
				Palette.width = window.innerWidth
				Palette.height = window.innerHeight

				Palette.createdCanvases.forEach(c => {
					c.width = Palette.width
					c.height = Palette.height
				})

				Palette.onResize.forEach(o => {
					o()
				})
			}, 50)
		})
	}

	static main() {
		const canvases = document.getElementById('canvases')

		const canvas = document.createElement('canvas')
		canvases.appendChild(canvas)
		Palette.createdCanvases.push(canvas)

		canvas.width = Palette.width
		canvas.height = Palette.height
		const ctx = canvas.getContext('2d')

		return {
			canvas,
			ctx,
		}
	}

	static offscreen(onResize=() => {}) {
		const canvas = new OffscreenCanvas(Palette.width, Palette.height)
		const ctx = canvas.getContext('2d')
		Palette.createdCanvases.push(canvas)

		this.onResize.push(onResize)

		return {
			canvas,
			ctx,
			width: Palette.width,
			height: Palette.height,
		}
	}

	static clear(canvases) {
		canvases.forEach(c => {
			c.ctx.clearRect(0, 0, Palette.width, Palette.height)
		})
	}

	static apply(mainPalette, palettes) {
		palettes.forEach(p => {
			mainPalette.ctx.drawImage(p.canvas, 0, 0)
		})
	}

	static fill(palette, color) {
		palette.ctx.fillStyle = color
		palette.ctx.fillRect(0, 0, Palette.width, Palette.height)
	}
}
