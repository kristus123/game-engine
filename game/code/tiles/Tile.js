export class Tile {
	constructor(index, position, picturePosition, layer, scale) {
	}

	erase() {
		this.layer.erasePixel(this.picturePosition)
		this.index = 0
	}


	highlight() {
		for (const p of this.layer.visiblePixelsIn(this.picturePosition)) {
			D1.box(Position(
				p.x*Scale.value*this.scale,
				p.y*Scale.value*this.scale,
				1*Scale.value*this.scale,
				1*Scale.value*this.scale,
			))
		}
	}


	pixelPosition(x, y) {
		return Position(
			this.position.x + (x*Scale.value*this.scale),
			this.position.y + (y*Scale.value*this.scale),
			Scale.value*this.scale,
			Scale.value*this.scale)
	}
}
