export class Velocity {
	constructor(object, x, y) {
	}

	oppositePosition() {
		return new Velocity(this.object, -this.x, -this.y)
	}

	draw(draw, guiDraw) {
		draw.circle(this.object.x + this.x, this.object.y + this.y, 10, 'orange')
	}
}
