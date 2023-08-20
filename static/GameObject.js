import { Draw } from '/static/Draw.js';


export class GameObject {
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height

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
