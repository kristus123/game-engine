import { Random } from '/static/Random.js';
import { GameObject } from '/static/GameObject.js'

export class PrettyParticles {
	constructor(physics) {
		this.physics = physics
		this.particles = [];
	}

	updateAndDraw(ctx, x, y) {
		const size = Random.numberBetween(10, 50)

		if (this.particles.length < 40) {
		const newParticle = new GameObject(x, y, size, size, 10, 200)
		newParticle.velocity = {
			x: Random.numberBetween(-1000, 1000),
			y: Random.numberBetween(-1000, 1000),
		}
		newParticle.life = 5000
		newParticle.color = Random.color()
		newParticle.name = "pp"
		this.particles.push(newParticle)
		this.physics.applyPhysics(newParticle)
		}

		this.particles.forEach((p, index) => {
			// p.x += p.velocity.x
			// p.y += p.velocity.y
			p.life--

			if (p.life <= 0) {
				this.particles.splice(index, 1);
			}
			else {
				ctx.fillStyle = p.color;
				ctx.fillRect(p.x, p.y, p.width, p.height);
			}
		})
	}
}
