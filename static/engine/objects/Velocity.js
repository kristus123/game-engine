export class Velocity {
	constructor(object, x=0, y=0) {
	}

	oppositePosition() {
		return new Velocity(this.object, -this.x, -this.y)
	}

	draw(draw, guiDraw) {
		draw.circle(this.object.x + this.x, this.object.y + this.y, 10, 'orange')
	}

	reset() {
		this.x = 0
		this.y = 0
	}

	rotate(angleDegrees) {
		const angleRadians = angleDegrees * (Math.PI / 180)
		const cosTheta = Math.cos(angleRadians)
		const sinTheta = Math.sin(angleRadians)

		const newX = this.x * cosTheta - this.y * sinTheta
		const newY = this.x * sinTheta + this.y * cosTheta

		this.x = newX
		this.y = newY
	}

}
