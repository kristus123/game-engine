export class CenterPosition {
	constructor(position, width, height) {
	}

	copy() {
		return this.position.copy()
	}

	get x() {
		return this.position.x + this.width / 2
	}

	get y() {
		return this.position.y + this.height / 2
	}



}
