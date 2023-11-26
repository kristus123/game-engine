export class Splash {
	constructor() {
		this.particles = []
	}

	splashOpposite(spawnPosition, mousePosition) {
		const angleSpread = 1;

		for (let i = 1; i <= 200; i++) {
			const size = Random.floatBetween(1, 5);
			const newParticle = new GameObject(spawnPosition.x, spawnPosition.y, size, size, 10, 200);

			// Calculate direction vector
			const direction = {
				x: spawnPosition.x - mousePosition.x, // Negate the x component
				y: spawnPosition.y - mousePosition.y, // Negate the y component
			};

			// Calculate initial angle
			const initialAngle = Math.atan2(direction.y, direction.x);

			// Add random angle spread within the specified range
			const spread = Random.floatBetween(-angleSpread / 2, angleSpread / 2);
			const angle = initialAngle + spread;

			const speed = Random.floatBetween(5, 10);

			// Calculate velocity components
			newParticle.velocity = {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed,
			};

			newParticle.life = 400;
			newParticle.color = "white";
			this.particles.push(newParticle);
		}
	}

	splash(spawnPosition, mousePosition, angleSpread=0.5, color='white') {

		for (let i = 1; i <= 200; i++) {
			const size = Random.floatBetween(1, 5);
			const newParticle = new GameObject(spawnPosition.x, spawnPosition.y, size, size, 10, 200);

			// Calculate direction vector
			const direction = {
				x: mousePosition.x - spawnPosition.x,
				y: mousePosition.y - spawnPosition.y,
			};

			// Calculate initial angle
			const initialAngle = Math.atan2(direction.y, direction.x);

			// Add random angle spread within the specified range
			const spread = Random.floatBetween(-angleSpread / 2, angleSpread / 2);
			const angle = initialAngle + spread;

			const speed = Random.floatBetween(5, 10);

			// Calculate velocity components
			newParticle.velocity = {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed,
			};

			newParticle.life = 400;
			newParticle.color = color
			this.particles.push(newParticle);
		}
	}

	draw(ctx) {
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
