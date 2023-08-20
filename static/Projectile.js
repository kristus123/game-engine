import { GameObject } from '/static/GameObject.js';
import { Draw } from '/static/Draw.js';


export class Projectile extends GameObject {
	constructor(x, y, radius, color) {
		super(x, y, 10, 10)

		this.radius = radius
		this.color = color

		this.to = {
			x: 0,
			y: 0,
		}
	}

	shoot(to) {
		this.to = to

		const dir = Math.atan2(to.y - this.y, to.x - this.x);

		const speed = 1000

		this.velocity = {
			x: Math.cos(dir) * speed,
			y: Math.sin(dir) * speed,
		}
	}

	draw(ctx) {
		Draw.lineBetween(ctx, this, this.to)
		Draw.circle(ctx, this.x, this.y, this.radius, this.color)
	}

}
