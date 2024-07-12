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

	set x(x) {
		this.position.x = x - (this.width / 2)
	}

	set y(y) {
		this.position.y = y - (this.height / 2)
	}

	get width() {
		return this.position.width
	}

	get height() {
		return this.position.height
	}

	set width(w) {
		this.position.width = w
	}

	set height(h) {
		this.position.height = h
	}

	behind(anotherPosition, distance) {
		return AnalShit.positionBehind(this, anotherPosition, distance)
	}

}
