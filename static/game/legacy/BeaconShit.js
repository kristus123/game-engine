export class BeaconShit extends DynamicGameObject {
	constructor(position) {
		super(new Position(position.x, position.y, 20, 20), 100, 10)

		this.radius = 0
	}

	update() {
		this.radius += 10
		if (this.radius >= 1500) {
			this.radius = 0
		}
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
		draw.hollowCircle(this.position, 'red', this.radius)
	}
}
