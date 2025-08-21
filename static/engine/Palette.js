export class Palette {
	static width = window.innerWidth
	static height = window.innerHeight

	static createdCanvases = []
	static onResize = []

	static {
		let debounceTimeout

		window.addEventListener('resize', () => {
			clearTimeout(debounceTimeout)

			debounceTimeout = setTimeout(() => {
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
			}, 100)
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
		ctx.imageSmoothingEnabled = false

		return {
			canvas,
			ctx,
		}
	}

	static offscreen(onResize=() => {}) {
		const canvas = new OffscreenCanvas(Palette.width, Palette.height)
		const ctx = canvas.getContext('2d')
		ctx.imageSmoothingEnabled = false

		Palette.createdCanvases.push(canvas)

		this.onResize.push(onResize)

		return {
			canvas,
			ctx,
			width: Palette.width,
			height: Palette.height,
		}
	}

	static fixedOffscreen(width, height) {
		const canvas = new OffscreenCanvas(width, height)
		const ctx = canvas.getContext('2d')
		ctx.imageSmoothingEnabled = false

		return {
			canvas,
			ctx,
			width: Palette.width,
			height: Palette.height,

			toImageBitmap: (run) => {
				canvas.convertToBlob()
					.then(blob => createImageBitmap(blob))
					.then(imageBitmap => {
						run(imageBitmap)
					})
			},

			rgba: () => {
				const result = []

				const pixels = ctx.getImageData(0, 0, Palette.width, Palette.height).data

				for (let i = 0; i < pixels.length; i += 4) {
					const r = pixels[i]
					const g = pixels[i + 1]
					const b = pixels[i + 2]
					const a = pixels[i + 3]

					result.push({
						i: i,
						r: r,
						g: g,
						b: b,
						a: a,
						rgba: `${r},${g},${b}`,
					})
				}

				return result
			},

			drawImage: image => {
				ctx.drawImage(image, 0, 0)
			},

			tintBlue: () => {
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
				const data = imageData.data

				for (let i = 0; i < data.length; i += 4) {
					const alpha = data[i + 3]
					if (alpha === 0) {
						continue
					} // Skip fully transparent pixels

					// Apply blue tint (adjust values as needed)
					data[i] *= 0.1 // Red
					data[i + 1] *= 0.7 // Green
					data[i + 2] = Math.min(data[i + 2] + 50, 255) // Boost blue
				}

				ctx.putImageData(imageData, 0, 0)

			},
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
