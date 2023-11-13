import { Collision } from '/static/Collision.js'

export class Physics {
	constructor() {
		this.objects = []
	}

	applyPhysics(o) {
		this.objects.push(o)
		return o
	}

	update(deltaTime) {
		for (let o of this.objects) {
			if (typeof deltaTime === 'number') {
				for (let anotherO of this.objects) {
					if (Collision.between(o, anotherO)) {
						if (o.onCollision) {
							o.onCollision(anotherO)
						}
					}
				}

				// Calculate friction based on weight
				const frictionFactor = 1 - o.weight / 5000 // Adjust this factor as needed

				// Apply friction to velocity
				o.velocity.x *= frictionFactor
				o.velocity.y *= frictionFactor

				o.x += o.velocity.x * deltaTime
				o.y += o.velocity.y * deltaTime
			}
		}
	}

	static applyAttraction(playerA, playerB) {
		const attractionForce = 100
		const maxAttractionDistance = 200

		const dx = playerB.x - playerA.x
		const dy = playerB.y - playerA.y

		const distance = Math.sqrt(dx * dx + dy * dy)

		if (distance > maxAttractionDistance) {
			const normalizedDistance = distance - maxAttractionDistance // Calculate how much further the players are beyond the maximum attraction distance
			const attractionFactor = normalizedDistance / maxAttractionDistance // Normalize the distance to a factor between 0 and 1

			const forceX =
				((attractionForce * dx) / distance) * attractionFactor
			const forceY =
				((attractionForce * dy) / distance) * attractionFactor

			playerA.velocity.x += forceX
			playerA.velocity.y += forceY

			// You can optionally apply a force on playerB as well
			// playerB.velocity.x -= forceX;
			// playerB.velocity.y -= forceY;
		}
	}

	static enforceMaxDistance(player, spaceship) {
		const velocityAdjustment = 1.1
		const maxDistance = 10

		const dx = spaceship.x - player.x
		const dy = spaceship.y - player.y
		const distance = Math.sqrt(dx * dx + dy * dy)

		if (distance > maxDistance) {
			const angle = Math.atan2(dy, dx)
			const targetX = player.x + Math.cos(angle) * maxDistance
			const targetY = player.y + Math.sin(angle) * maxDistance

			const diffX = targetX - spaceship.x
			const diffY = targetY - spaceship.y

			const targetVelocityX = diffX * velocityAdjustment
			const targetVelocityY = diffY * velocityAdjustment

			// Calculate the magnitude of the target velocity
			const targetVelocityMagnitude = Math.sqrt(
				targetVelocityX * targetVelocityX +
					targetVelocityY * targetVelocityY,
			)

			// Adjust playerB's velocity based on the target velocity magnitude and direction
			// spaceship.velocity.x = targetVelocityX;
			// spaceship.velocity.y = targetVelocityY;

			// If the target velocity magnitude exceeds maxDistance, scale it down
			if (targetVelocityMagnitude > maxDistance) {
				// playerB.velocity.x *= maxDistance / targetVelocityMagnitude;
				// playerB.velocity.y *= maxDistance / targetVelocityMagnitude;
			}

			// Adjust playerA's velocity as well if desired
			//
			player.velocity.x -= diffX * velocityAdjustment
			player.velocity.y -= diffY * velocityAdjustment
		}
	}
}
