export class Physics {
	constructor() {
		this.objects = []
	}

	static global = new Physics()

	applyPhysics(o) {
		this.objects.push(o)
		return o
	}

	removePhysics(o) {
		List.remove(this.objects, o)
	}

	update(deltaTime) {
		for (let o of this.objects) {
			// for (let anotherO of this.objects) {
			// 	if (Collision.between(o, anotherO)) {
			// 		if (o.onCollision) {
			// 			o.onCollision(anotherO)
			// 		}
			// 	}
			// }

			const frictionFactor = 1 - o.weight / 5000 // Adjust this factor as needed

			// Apply friction to velocity with deltaTime
			o.velocity.x *= Math.pow(frictionFactor, deltaTime)
			o.velocity.y *= Math.pow(frictionFactor, deltaTime)

			o.x += o.velocity.x * deltaTime
			o.y += o.velocity.y * deltaTime
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

	static enforceMaxDistance(player, spaceship, maxDistance=100, velocityAdjustment=0.2) {
		const dx = spaceship.x - player.x
		const dy = spaceship.y - player.y
		const distance = Math.sqrt(dx * dx + dy * dy)

		if (distance > maxDistance) {
			const angle = Math.atan2(dy, dx)
			const targetX = player.x + Math.cos(angle) * maxDistance
			const targetY = player.y + Math.sin(angle) * maxDistance

			const diffX = targetX - spaceship.x
			const diffY = targetY - spaceship.y

			player.velocity.x -= diffX * velocityAdjustment
			player.velocity.y -= diffY * velocityAdjustment
		}
	}

	static enforceMinDistance(player, spaceship, minDistance=100, velocityAdjustment=0.3) {

		const dx = spaceship.x - player.x;
		const dy = spaceship.y - player.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < minDistance) {
			const angle = Math.atan2(dy, dx);
			const targetX = player.x + Math.cos(angle) * minDistance;
			const targetY = player.y + Math.sin(angle) * minDistance;

			const diffX = targetX - spaceship.x;
			const diffY = targetY - spaceship.y;

			player.velocity.x -= diffX * velocityAdjustment;
			player.velocity.y -= diffY * velocityAdjustment;
		}
	}





}
