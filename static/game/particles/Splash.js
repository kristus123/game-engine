export class Splash {
	constructor() {
		this.particles = []

		this.minAngle = 0
		this.maxAngle = 0
	}

	update() {

	}

	splash(spawnPosition, mousePosition, angleSpread = 0.4, color = 'white', speed = null, life = 10) {
		// spawnPosition = Get.Position(spawnPosition)
		// mousePosition = Get.Position(mousePosition)

		let minAngle = Infinity
		let maxAngle = -Infinity

		// color = Random.choice(['white', 'blue', 'orange', 'yellow', 'red'])
		for (let i = 1; i <= 10; i++) {

			const size = Random.floatBetween(1, 5)
			const newParticle = new DynamicGameObject(new Position(spawnPosition.x, spawnPosition.y, size, size), 5, 400)

			// Calculate direction vector
			const direction = {
				x: mousePosition.x - spawnPosition.x,
				y: mousePosition.y - spawnPosition.y,
			}

			speed = speed || Random.floatBetween(1, 5)


			// Calculate initial angle
			const initialAngle = Math.atan2(direction.y, direction.x)

			// Add random angle spread within the specified range
			const spread = Random.floatBetween(-angleSpread / 2, angleSpread / 2)
			const angle = initialAngle + spread

			// Update min and max angles
			minAngle = Math.min(minAngle, angle)
			maxAngle = Math.max(maxAngle, angle)

			// !! speed used to be randomized.

			// Calculate velocity components
			newParticle.velocity = {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed,
			}

			newParticle.life = life
			newParticle.color = color
			this.particles.push(newParticle)
			Physics.global.removePhysics(newParticle)
		}

		this.minAngle = minAngle
		this.maxAngle = maxAngle
	}


	splashOpposite(spawnPosition, mousePosition, angleSpread = 0.4, color = 'white', speed = null) {
		spawnPosition = Get.Position(spawnPosition)
		mousePosition = Get.Position(mousePosition)

		let minAngle = Infinity
		let maxAngle = -Infinity

		for (let i = 1; i <= 400; i++) {
			const size = Random.floatBetween(1, 5)
			const newParticle = new DynamicGameObject(new Position(spawnPosition.x, spawnPosition.y, size, size), 5, 400)

			// Calculate direction vector in the opposite direction
			const direction = {
				x: spawnPosition.x - mousePosition.x,
				y: spawnPosition.y - mousePosition.y,
			}

			speed = Random.floatBetween(1, 5)

			// Calculate initial angle
			const initialAngle = Math.atan2(direction.y, direction.x)

			// Add random angle spread within the specified range
			const spread = Random.floatBetween(-angleSpread / 2, angleSpread / 2)
			const angle = initialAngle + spread

			// Update min and max angles
			minAngle = Math.min(minAngle, angle)
			maxAngle = Math.max(maxAngle, angle)

			// Calculate velocity components
			newParticle.velocity = {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed,
			}

			newParticle.life = 200
			newParticle.color = color
			this.particles.push(newParticle)
			Physics.global.removePhysics(newParticle)
		}

		this.minAngle = minAngle
		this.maxAngle = maxAngle
	}




	draw(draw, guiDraw) {
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
