export class Particle {
	constructor(x, y, radius, velocity) {

		this.angle = Math.random() * Math.PI * 2 // Initial angle
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

	draw(draw, guiDraw) {
		draw.ctx.lineWidth = 2

		for (let i = 0; i < this.prevPositions.length - 1; i++) {
			const pos = this.prevPositions[i]
			const nextPos = this.prevPositions[i + 1]

			draw.ctx.strokeStyle = `${this.color} ${pos.opacity})`
			draw.ctx.beginPath()
			draw.ctx.moveTo(pos.x, pos.y)
			draw.ctx.lineTo(nextPos.x, nextPos.y)
			this.PrettyParticles.updateAndDrawdraw(draw.ctx, nextPos.x, nextPos.y)
			draw.ctx.stroke()
		}

		const particleX = this.x + Math.cos(this.angle) * this.radius
		const particleY = this.y + Math.sin(this.angle) * this.radius

		draw.ctx.fillStyle = this.color
		draw.ctx.beginPath()
		draw.ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI)
		draw.ctx.fill()
	}
}
