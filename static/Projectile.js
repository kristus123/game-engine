import { GameObject } from '/static/GameObject.js'
import { Draw } from '/static/Draw.js'

export class Projectile extends GameObject {
	constructor() {
		super(0, 0, 10, 10, 0, 4000)
		this.from = null

		this.radius = 10
		this.color = 'red'

		this.to = {
			x: 0,
			y: 0,
		}

		this.connectedTo = null
		this.shot = false
	}

	onCollision(o) {
		if (this.shot) {
			this.connectedTo = o
		}
	}

	shoot(from, to) {
		this.from = from
		this.connectedTo = false

		this.x = from.x + 200
		this.y = from.y + 200

		this.to = to
		this.shot = true

		const dir = Math.atan2(to.y - this.y, to.x - this.x)
		this.velocity = {
			x: Math.cos(dir) * this.velocityFactor,
			y: Math.sin(dir) * this.velocityFactor,
		}
	}

	draw(ctx) {
		if (this.shot && this.connectedTo) {
			Draw.lineBetween(ctx, this.from, this.connectedTo)
			Draw.circle(
				ctx,
				this.connectedTo.x,
				this.connectedTo.y,
				this.radius,
				this.color,
			)
		}
		else if (this.shot) {
			Draw.circle(ctx, this.x, this.y, this.radius, this.color)
			Draw.lineBetween(ctx, this.from, this)
		}
	}
}
