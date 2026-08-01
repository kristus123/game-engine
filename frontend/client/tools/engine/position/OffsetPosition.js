export class OffsetPosition {
	constructor(position, offset_x=0, offset_y=0, width=position.width, height=position.height) {
	}

	get x() {
		return this.position.x + this.offset_x
	}

	get y() {
		return this.position.y + this.offset_y
	}

	copy() {
		return WorldPosition(this.position.x + this.offset_x, this.position.y + this.offset_y, this.width, this.height)
	}

	behind(anotherPosition, distance) {
		return AnalShit.positionBehind(this, anotherPosition, distance)
	}

}
