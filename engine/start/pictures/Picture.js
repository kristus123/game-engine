export class Picture {
	constructor(position, image) {
		this.canvas = document.createElement('canvas')
		this.ctx = this.canvas.getContext('2d')

		this.canvas.width = image.naturalWidth ?? image.width
		this.canvas.height = image.naturalHeight ?? image.height

		this.ctx.drawImage(image, 0, 0)
	}

	copy() {
		return new Picture(this.position, this.canvas)
	}

	setPixel(p, r = 255, g = 255, b = 255, a = 255) {
		this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`
		this.ctx.fillRect(p.x, p.y, p.width, p.height)
	}

	move(p, picture) {
		const c = this.pixelColor(p)
		this.erasePixel(p)
		picture.setPixel(p, c.r, c.g, c.b, c.a)
		console.log(c)
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	erasePixel(p) {
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


	update(frame) {
		D1.sprite(this.position, frame, this.canvas)
	}

	draw() {
		const x = Scale.value*7
		D2.picture(Position(0, 0, this.canvas.width*x, this.canvas.height*x), this.canvas)
	}
}
