export class CenterPosition {
	constructor(position, width, height) {
		this.position = position
		this.width = width
		this.height = height
	}

	get x() {
		return this.position.x + this.width / 2
	}

	get y() {
		return this.position.y + this.height / 2
	}
	
}
