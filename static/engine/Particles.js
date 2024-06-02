function velocityTo(spawnPosition, targetPosition, angleSpread) {
	const direction_x = targetPosition.x - spawnPosition.x
	const direction_y = targetPosition.y - spawnPosition.y

	const spread = Random.floatBetween(-angleSpread / 2, angleSpread / 2)
	const initialAngle = Math.atan2(direction_y, direction_x)
	const angle = initialAngle + spread

	return {
		x: Math.cos(angle) * Random.floatBetween(1, 5),
		y: Math.sin(angle) * Random.floatBetween(1, 5),
	}
}

export class Particles {
	constructor() {
	}

	static towards(spawnPosition, targetPosition, angleSpread = 0.4) {

		const size = Random.floatBetween(1, 5)
		const particle = new DynamicGameObject(new Position(spawnPosition.x, spawnPosition.y, size, size), 1, 4000)

		const v = velocityTo(spawnPosition, targetPosition, angleSpread)
		particle.velocity = new Velocity(particle, v.x * 10, v.y * 10)

		return particle
	}
}
