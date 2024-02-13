// maybe call it RelativePosition instead?
// Since the position is relative to another position?
export class OffsetPosition {
	constructor(position, x, y) { // IGNORE
		this.position = position

		this.offset = {
			x:x,
			y:y,
		}
	}

	get x() {
		return this.position.x + this.offset.x
	}

	get y() {
		return this.position.y + this.offset.y
	}

}
