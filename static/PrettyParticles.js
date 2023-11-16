
export class PrettyParticles {
	constructor() {
		this.particles = []
	}

	piss(ctx, x, y, mousePosition) {
		const size = Random.floatBetween(1, 5)

		if (this.particles.length < 100) {
			const newParticle = new GameObject(x, y, size, size, 10, 200)
			newParticle.velocity = {
				x: Random.floatBetween(1,3),
				y: Random.floatBetween(1,3),
			}

			newParticle.life = 100
			newParticle.color = 'yellow'
			this.particles.push(newParticle)
		}

		this.particles.forEach((p, index) => {
			p.x += p.velocity.x
			p.y += p.velocity.y

			p.life--

			if (p.life <= 0) {
				this.particles.splice(index, 1)
			}
			else {
				ctx.fillStyle = 'yellow'
				ctx.fillRect(p.x, p.y, p.width, p.height)
			}
		})
	}

	updateAndDraw(ctx, x, y) {
		const size = Random.floatBetween(1, 10)

		if (this.particles.length < 1000) {
			const newParticle = new GameObject(x, y, size, size, 10, 200)
			newParticle.velocity = {
				x: Random.floatBetween(-2.0, 2.0),
				y: Random.floatBetween(-2.0, 2.0),
			}

			newParticle.life = 400
			newParticle.color = Random.color()
			this.particles.push(newParticle)
		}

		this.particles.forEach((p, index) => {
			p.x += p.velocity.x
			p.y += p.velocity.y

			p.life--

			if (p.life <= 0) {
				this.particles.splice(index, 1)
			}
			else {
				ctx.fillStyle = p.color
				ctx.fillRect(p.x, p.y, p.width, p.height)
			}
		})
	}
}
