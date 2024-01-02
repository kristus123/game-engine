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

	draw(ctx) {
		super.draw(ctx)
		Draw.hollowCircle(ctx, this.position, 'red', this.radius)
	}
}
