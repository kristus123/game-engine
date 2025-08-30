export class Particle {

	static towards(spawnPosition, targetPosition) {

		const size = Random.floatBetween(1, 5)
		const particle = new DynamicGameObject(new Position(spawnPosition.x, spawnPosition.y, size, size), 1, 4000)

		Forces.roughlyTowards(particle, targetPosition, { additive: true, multiplier: 0.1})

		return particle
	}
}
