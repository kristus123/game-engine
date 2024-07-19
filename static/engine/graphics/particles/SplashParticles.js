export class SplashParticles {
	constructor(player, thing) {
		this.particles = []
	}

	draw(draw, guiDraw) {
		const size = Random.floatBetween(1, 10)

		if (this.particles.length < 1000) {
			const newParticle = new DynamicGameObject(new Position(this.player.position.x, this.player.position.y, size, size), 10, 200)
			// Push(newParticle).towards(Mouse.position, 0.1)

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
				draw.ctx.fillStyle = p.color
				draw.ctx.fillRect(p.x, p.y, p.width, p.height)
			}
		})
	}
}
