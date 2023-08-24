import { Random } from '/static/Random.js';

export class PrettyParticles {
	constructor() {
		 this.particles = [];
	}

	updateAndDraw(ctx, x, y) {
		this.particles.push({
		  x,
		  y,
		  size: Random.numberBetween(1, 50),
		  color: Random.color(),
		  speedX: Random.numberBetween(-10, 10),
		  speedY: Random.numberBetween(-10, 10),
		  life: 50,
		})

		this.particles.forEach((p, index) => {
			p.x += p.speedX;
			p.y += p.speedY;
			p.life--;

			if (p.life <= 0) {
				this.particles.splice(index, 1);
			}
			else {
				ctx.fillStyle = p.color;
				ctx.fillRect(p.x, p.y, p.size, p.size);
			}
		})
	}
}
