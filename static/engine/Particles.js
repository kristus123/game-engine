export class Particles {
	constructor() {
	}

	towards(spawnPosition, mousePosition, angleSpread = 0.4) {
		const size = Random.floatBetween(1, 5)
		const particle = new DynamicGameObject(new Position(spawnPosition.x, spawnPosition.y, size, size), 5, 400)

		const direction = {
			x: mousePosition.x - spawnPosition.x,
			y: mousePosition.y - spawnPosition.y,
		}

		const spread = Random.floatBetween(-angleSpread / 2, angleSpread / 2)
		const initialAngle = Math.atan2(direction.y, direction.x)
		const angle = initialAngle + spread

		particle.velocity = new Velocity(particle, 
			Math.cos(angle) * Random.floatBetween(1, 5), // x
			Math.sin(angle) * Random.floatBetween(1, 5)) // y

		return particle
	}
}
