export class Tile {
	constructor(index, position, picturePosition, layer, scale) {
	}

	erase() {
		this.layer.erasePixel(this.picturePosition)
	}

	pixelPosition(x, y) {
		return Position(
			this.position.x + (x*Scale.value*this.scale),
			this.position.y + (y*Scale.value*this.scale),
			Scale.value*this.scale,
			Scale.value*this.scale)
	}
}