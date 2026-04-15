export class Picture {
	constructor(image) {
		this.canvas = document.createElement("canvas")
		this.ctx = this.canvas.getContext("2d")

		this.canvas.width = image.naturalWidth ?? image.width
		this.canvas.height = image.naturalHeight ?? image.height

		this.ctx.drawImage(image, 0, 0)
	}

	crop(sx, sy, sw, sh) {

		const newCanvas = document.createElement("canvas")
		const newCtx = newCanvas.getContext("2d")

		newCanvas.width = sw
		newCanvas.height = sh

		newCtx.drawImage(
			this.canvas,
			sx, sy, sw, sh, // source
			0, 0, sw, sh // destination
		)

		this.canvas = newCanvas
		this.ctx = newCtx

		return this
	}

	*visiblePixelsIn(picturePosition) {
		for (const xy of picturePosition.points()) {
			const c = this.pixelColor(xy)
			if (c.a != 0) {
				yield xy
			}
		}
	}

	copy() {
		return new Picture(this.canvas)
	}

	setPixel(p, r = 255, g = 255, b = 255, a = 255) {
		this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`
		this.ctx.fillRect(p.x, p.y, p.width, p.height)
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	erase(p) {
		this.ctx.clearRect(p.x, p.y, p.width, p.height)
	}

	pixelColor(p) {
		const data = this.ctx.getImageData(p.x, p.y, 1, 1).data

		return {
			r: data[0],
			g: data[1],
			b: data[2],
			a: data[3]
		}
	}

	update(p, d) {
		D1.ctx.drawImage(this.canvas, p.x, p.y, p.width, p.height)
	}

}
