import { Draw } from '/static/Draw.js';


export class GameObject {
	constructor(x, y, width, height, weight, velocityFactor) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.weight = weight
		this.velocityFactor = velocityFactor

		this.velocity = {
			x: 0,
			y: 0,
		}
	}

	update() {
	}

	draw(ctx) {
		Draw.rectangle(ctx, this.x, this.y, this.width, this.height)
	}
}
