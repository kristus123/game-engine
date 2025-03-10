
// const renderer = new CanvasRenderer()
// const pos = new Position(0, 0, 10, 10)
// renderer.draw.rectangle(new Position(50, 0, 1000, 1000))
// renderer.renderImageBitmap()
// draw.imageBitmap(new Position(0,0), renderer.ib)


export class CanvasRenderer {
	constructor(width = 100, height = 100) {
		this.palette = Palette.fixedOffscreen(width, height)
		this.ctx = this.palette.canvas.getContext('2d')

		this.draw = new Draw(this.palette.ctx)

		this.ib = null
	}


	tintBlue() {
		const ctx = this.palette.ctx
		const canvas = this.palette.canvas
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
	}

	renderImageBitmap(run) {
		this.palette.canvas.convertToBlob()
			.then(blob => createImageBitmap(blob))
			.then(imageBitmap => {
				this.ib = imageBitmap
				run()
			})
	}
}

