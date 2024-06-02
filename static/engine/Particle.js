export class Particle {

	static towards(spawnPosition, targetPosition, angleSpread = 0.4) {

		const size = Random.floatBetween(1, 5)
		const particle = new DynamicGameObject(new Position(spawnPosition.x, spawnPosition.y, size, size), 1, 4000)

		const v = Random.velocityTowards(spawnPosition, targetPosition, angleSpread)
		particle.velocity = new Velocity(particle, v.x, v.y)

		return particle
	}
}
