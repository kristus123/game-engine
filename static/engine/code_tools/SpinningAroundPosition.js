export class SpinningAroundPosition {
	constructor(dynamicGameObject) {
		this.angle = 0

		this.cleanPosition = new Position()
		this.position = new Position()
	}

	update() {
		const radius = 200

		this.cleanPosition.x = this.dynamicGameObject.position.center.x + radius * Math.cos(this.angle)
		this.cleanPosition.y = this.dynamicGameObject.position.center.y + radius * Math.sin(this.angle)

		this.position = Random.direction(this.cleanPosition, 200)
	}

	draw(draw, guiDraw) {

		draw.circle(this.position.x, this.position.y, 10, 'red')

		this.angle += 0.03
	}

}
