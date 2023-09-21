import { Draw } from '/static/scripts/Draw.js';

export class GameObject {
	constructor(x, y, width, height, weight, velocityFactor) {
		// todo : instead of x,y use position{x,y}
		this.x = x
		this.y = y

		// todo rename to dimensions, width, height
		this.width = width
		this.height = height

		// todo rename to momentum (weight, velocityFactor)
		this.weight = weight
		this.velocityFactor = velocityFactor
		// todo : create a center field which returns position

		this.velocity = {
			x: 0,
			y: 0,
		}
	}

	middle() {
		return {
			x: this.x / this.width,
			y: this.y / this.height,
		}
		
	}

	update() {
	}

	draw(ctx) {
		Draw.rectangle(ctx, this.x, this.y, this.width, this.height)
	}
}
