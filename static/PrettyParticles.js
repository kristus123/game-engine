import { Random } from '/static/Random.js';
import { GameObject } from '/static/GameObject.js'

export class PrettyParticles {
	constructor() {
		this.particles = [];
	}

	updateAndDraw(ctx, x, y) {
		const size = Random.numberBetween(1, 2)

		if (this.particles.length < 2) {
			const newParticle = new GameObject(x, y, size, size, 10, 200)
			newParticle.velocity = {
				x: Random.numberBetween(-1.0, 1.0),
				y: Random.numberBetween(-1.0, 1.0),
			}

			newParticle.life = 2000
			newParticle.color = 'blue' //Random.color()
			this.particles.push(newParticle)
		}

		this.particles.forEach((p, index) => {
			p.x += p.velocity.x
			p.y += p.velocity.y

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
