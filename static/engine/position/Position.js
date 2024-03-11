export class Position {
	constructor(x, y, width=1, height=1) {
		this.center = new CenterPosition(this, width, height)
	}

	copy() {
		return new Position(this.x, this.y, this.width, this.height)
	}

	offset(x=0, y=0, width, height) {
		return new OffsetPosition(this, x, y, width, height)
	}

}
