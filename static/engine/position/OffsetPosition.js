// maybe call it RelativePosition instead?
// Since the position is relative to another position?
export class OffsetPosition {
	constructor(position, _x=0, _y=0) {
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

}
