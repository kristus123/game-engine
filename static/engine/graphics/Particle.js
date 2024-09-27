export class Particle {

	static towards(spawnPosition, targetPosition) {

		const size = Random.floatBetween(1, 5)
		const particle = new DynamicGameObject(new Position(spawnPosition.x, spawnPosition.y, size, size), 1, 4000)

		Push(particle).roughlyTowards(targetPosition, 0.1)

		return particle
	}
}
