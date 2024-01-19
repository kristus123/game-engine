export class BeaconShit extends GameObject {
	constructor(position) {
		super(position.x, position.y, 20, 20, 100, 10)

		this.radius = 0
	}

	update() {
		this.radius += 10
		if (this.radius >= 1500) {
			this.radius = 0
		}
	}

	draw(draw) {
		super.draw(draw.ctx)
		draw.hollowCircle(this.position, 'red', this.radius)
	}
}
