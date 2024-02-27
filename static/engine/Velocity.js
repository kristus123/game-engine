export class Velocity {
	constructor(object, x, y) {
	}

	oppositePosition() {
		return new Velocity(this.object, -this.x, -this.y)
	}

	draw(draw) {
		draw.circle(this.x, this.y, 10, 'orange')
	}

}
