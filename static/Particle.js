import { PrettyParticles } from '/static/PrettyParticles.js'
import { Random } from '/static/Random.js'

export class Particle {
	constructor(x, y, radius, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.angle = Math.random() * Math.PI * 2 // Initial angle
		this.velocity = velocity
		this.color = Random.color()
		this.opacity = 1
		this.prevPositions = []

		this.PrettyParticles = new PrettyParticles()
	}

	updatePhysics(deltaTime) {
		this.angle += this.velocity * deltaTime
		this.opacity -= deltaTime * 0.2 // Reduce fade rate for smoother tail
	}

	update() {
		this.prevPositions.push({
			x: this.x + Math.cos(this.angle) * this.radius,
			y: this.y + Math.sin(this.angle) * this.radius,
			opacity: this.opacity,
		})

		if (this.prevPositions.length > 20) {
			this.prevPositions.shift() // Remove oldest position
		}
	}

	draw(ctx) {
		ctx.lineWidth = 2

		for (let i = 0; i < this.prevPositions.length - 1; i++) {
			const pos = this.prevPositions[i]
			const nextPos = this.prevPositions[i + 1]

			ctx.strokeStyle = `${this.color} ${pos.opacity})`
			ctx.beginPath()
			ctx.moveTo(pos.x, pos.y)
			ctx.lineTo(nextPos.x, nextPos.y)
			this.PrettyParticles.updateAndDraw(ctx, nextPos.x, nextPos.y)
			ctx.stroke()
		}

		const particleX = this.x + Math.cos(this.angle) * this.radius
		const particleY = this.y + Math.sin(this.angle) * this.radius

		ctx.fillStyle = this.color
		ctx.beginPath()
		ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI)
		ctx.fill()
	}
}
