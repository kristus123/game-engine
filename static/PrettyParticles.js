import { Random } from '/static/Random.js';

export class PrettyParticles {
	constructor() {
		 this.particles = [];
	}

	updateAndDraw(ctx, x, y) {
		this.particles.push({
		  x,
		  y,
		  size: Math.random() * 5 + 2,
		  color: Random.color(),
		  speedX: Math.random() * 3 - 1.5,
		  speedY: Math.random() * 3 - 1.5,
		  life: 500
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
