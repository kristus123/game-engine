export class Collision {
	static between(red, blue) {
		return (
			red != blue &&
			red.x + red.width >= blue.x &&
			red.x <= blue.x + blue.width &&
			red.y + red.height >= blue.y &&
			red.y <= blue.y + blue.height)
	}

	static deny(red, blue) {
		if (!this.between(red, blue) || red == blue) {
			return
		}

		const overlapX =
			(Math.min(red.x + red.width, blue.x + blue.width) - Math.max(red.x, blue.x)) * 5
		const overlapY =
			(Math.min(red.y + red.height, blue.y + blue.height) - Math.max(red.y, blue.y)) * 5

		if (overlapX < overlapY) {
			if (red.x < blue.x) {
				red.x -= overlapX
			}
			else {
				red.x += overlapX
			}
		}
		else {
			if (red.y < blue.y) {
				red.y -= overlapY
			}
			else {
				red.y += overlapY
			}
		}
	}

	static pushOutwards(collider, collidingEntity) {
		const overlapX = Math.min(collider.x + collider.width - collidingEntity.sprite.collider.x,
									collidingEntity.sprite.collider.x + collidingEntity.sprite.collider.width - collider.x)

		const overlapY = Math.min(collider.y + collider.height - collidingEntity.sprite.collider.y,
									collidingEntity.sprite.collider.y + collidingEntity.sprite.collider.height - collider.y)

		const centerColliderX =
			collider.x + collider.width * 0.5
		const centerColliderY =
			collider.y + collider.height * 0.5

		const centerCollidingEntityX =
			collidingEntity.sprite.collider.x + collidingEntity.sprite.collider.width * 0.5
		const centerCollidingEntityY =
			collidingEntity.sprite.collider.y + collidingEntity.sprite.collider.height * 0.5

		let pushX
		let pushY

		if (centerCollidingEntityX < centerColliderX) {
			pushX = -overlapX
		}
		else {
			pushX = overlapX
		}

		if (centerCollidingEntityY < centerColliderY) {
			pushY = -overlapY
		}
		else {
			pushY = overlapY
		}

		if (overlapX < overlapY) {
			collidingEntity.position.x += pushX
		}

		if (overlapX > overlapY) {
			collidingEntity.position.y += pushY
		}
	}

	static applyCollisionBetween(collider, collidingEntity) {
		if (this.between(collider, collidingEntity)) {
			this.pushOutwards(collider, collidingEntity)
		}
	}
}
