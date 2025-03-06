export class CanvasRenderer {
    constructor(width = 100, height = 100) {
		this.palette = Palette.fixedOffscreen(width, height) 
        this.ctx = this.palette.canvas.getContext("2d");

		this.draw = new Draw(this.palette.ctx)
    }

    renderImageBitmap() {
        this.palette.canvas.convertToBlob()
			.then(blob => createImageBitmap(blob))
			.then(imageBitmap => {
				this.ib = imageBitmap
			})
    }
}

