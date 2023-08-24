import { GameObject } from '/static/GameObject.js';
import { Draw } from '/static/Draw.js';

export class Projectile extends GameObject {
	constructor(from, radius, color) {
		super(0, 0, 10, 10, 0, 5000)
		this.from = from

		this.radius = radius
		this.color = color

		this.to = {
			x: 0,
			y: 0,
		}

		this.connectedTo = null
		this.shot = false
	}

	onHit(o) {
		if (this.shot) {
			this.connectedTo = o
		}
		// this.shot = false

		// this.velocity = {
		// 	x: 0,
		// 	y: 0,
		// }
	}

	shoot(from, to) {
		this.connectedTo = false
		this.x = from.x + 30
		this.y = from.y + 30

		this.to = to
		this.shot = true

		const dir = Math.atan2(to.y - this.y, to.x - this.x);
		const speed = this.velocityFactor
		this.velocity = {
			x: Math.cos(dir) * speed,
			y: Math.sin(dir) * speed,
		}
	}

	draw(ctx) {
		if (this.shot && this.connectedTo) {
			Draw.lineBetween(ctx, this.from, this.connectedTo)
			Draw.circle(ctx, this.connectedTo.x, this.connectedTo.y, this.radius, this.color)
		}
		else if (this.shot) {
			Draw.circle(ctx, this.x, this.y, this.radius, this.color)
			Draw.lineBetween(ctx, this.from, this)
		}
	}
}
