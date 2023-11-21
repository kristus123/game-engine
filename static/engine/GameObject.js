export class GameObject {
	constructor(x, y, width, height, weight, velocityFactor) {
		// todo : instead of x,y use position{x,y}
		this.x = x
		this.y = y

		// todo rename to dimensions, width, height
		// e.q like this:
		// this.dimensions = {width, height}
		this.width = width
		this.height = height

		this.weight = weight
		this.velocityFactor = velocityFactor

		this.velocity = {
			x: 0,
			y: 0,
		}
	}

	// todo: maybe this.x should always be center.x ? : sounds like a good idea
	get position() {
		return {
			x: this.x,
			y: this.y,

			center: {
				x: this.x / this.width,
				y: this.y / this.height,
			}
		}
	}

	update() {}

	draw(ctx) {
		Draw.rectangle(ctx, this.x, this.y, this.width, this.height)
	}

	followIfOutsideOfRadius(o, radius) {
		if (Distance.calculateDistance(this, o) > radius) {
			const angle = Math.atan2(o.y - this.y, o.x - this.x)

			this.x = o.x - radius * Math.cos(angle)
			this.y = o.y - radius * Math.sin(angle)
		}
	}
}
