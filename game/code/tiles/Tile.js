export class Tile {
	constructor(index, position, picturePosition, layer, scale) {
	}

	erase() {
		this.layer.erasePixel(this.picturePosition)
	}

tintBlue() {
	D1.ctx.save()

	D1.ctx.fillStyle = 'rgba(0,0,255,0.4)'

	const scale = Scale.value*this.scale

	for (const [x,y] of [
		[2,2],
		[3,2],
		[4,2],
		[5,2],
	]) {
		const pp = this.pixelPosition(x, y)
		D1.ctx.fillRect(pp.x, pp.y, pp.width, pp.height)
	}

	D1.ctx.restore()
}


	pixelPosition(x, y) {
		return Position(
			this.position.x + (x*Scale.value*this.scale),
			this.position.y + (y*Scale.value*this.scale),
			Scale.value*this.scale,
			Scale.value*this.scale)
	}
}
