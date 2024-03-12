export class OffsetPosition {
	constructor(position, _x=0, _y=0, width=position.width, height=position.height) {
		this.offset = {
			x:_x,
			y:_y,
		}
	}

	get x() {
		return this.position.x + this.offset.x
	}

	get y() {
		return this.position.y + this.offset.y
	}

	copy() {
		return new Position(this.position.x + this.offset.x, this.position.y + this.offset.y, this.position.width, this.position.height)
	}

}
