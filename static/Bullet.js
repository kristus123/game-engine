export class Bullet extends GameObject {

	constructor() {
		super(0, 0, 10, 10, 0, 4000)

		this.to = {
			x: 0,
			y: 0,
		}

		this.to = null
		this.hit = null
	}

	onCollision(o) {
		this.hit = o
	}

	shoot(to) {
		this.to = to

		const dir = Math.atan2(to.y - this.y, to.x - this.x)
		this.velocity = {
			x: Math.cos(dir) * this.velocityFactor,
			y: Math.sin(dir) * this.velocityFactor,
		}
	}

	draw(ctx) {
		if (this.to) {
			Draw.lineBetween(ctx, this, this.to)
		}
	}
}
