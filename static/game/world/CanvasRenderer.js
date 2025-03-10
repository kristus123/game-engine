
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

	renderImageBitmap(run) {
		this.palette.canvas.convertToBlob()
			.then(blob => createImageBitmap(blob))
			.then(imageBitmap => {
				this.ib = imageBitmap
				run()
			})
	}
}

