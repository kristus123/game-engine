export class OffsetPosition {
	constructor(position, _x=0, _y=0, _width=position.width, _height=position.height) {
		this.offset = {
			x:_x,
			y:_y,
			newWidth: _width,
			newHeight: _height,
		}
	}

	get x() {
		return this.position.x + this.offset.x
	}

	get y() {
		return this.position.y + this.offset.y
	}

	get width() {
		return this.offset.newWidth
	}

	get height() {
		return this.offset.newHeight
	}

	copy() {
		return new Position(this.position.x + this.offset.x, this.position.y + this.offset.y, this.position.width, this.position.height)
	}

}
