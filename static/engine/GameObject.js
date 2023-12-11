export class GameObject {
	constructor(x, y, width, height, weight, velocityFactor) {
		this.width = width
		this.height = height

		this.position = new Position(x, y, width, height)

		this.weight = weight
		this.velocityFactor = velocityFactor

		this.velocity = {
			x: 0,
			y: 0,
		}

		Physics.global.applyPhysics(this)
	}

	onCollision(o) {
		// Push(this).awayFrom(o)
	}

	update() {}

	draw(ctx) {
		Draw.new_rectangle(ctx, this.position)
		Draw.new_circle(ctx, this.position.center, 10)
	}

	followIfOutsideOfRadius(o, radius) {
		if (Distance.calculateDistance(this, o) > radius) {
			const angle = Math.atan2(o.y - this.y, o.x - this.x)

			this.x = o.x - radius * Math.cos(angle)
			this.y = o.y - radius * Math.sin(angle)
		}
	}

	get x() {
		return this.position.x
	}

	get y() {
		return this.position.y
	}

	set x(x) {
		this.position.x = x
	}

	set y(y) {
		this.position.y = y
	}

}
