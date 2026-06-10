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
		const collidingEntityCollider = collidingEntity.sprite.collider

		const overlapX = Math.min(collider.x + collider.width - collidingEntityCollider.x,
									collidingEntityCollider.x + collidingEntityCollider.width - collider.x)

		const overlapY = Math.min(collider.y + collider.height - collidingEntityCollider.y,
									collidingEntityCollider.y + collidingEntityCollider.height - collider.y)

		const centerColliderX =
			collider.x + collider.width * 0.5
		const centerColliderY =
			collider.y + collider.height * 0.5

		const centerCollidingEntityColliderX =
			collidingEntityCollider.x + collidingEntityCollider.width * 0.5
		const centerCollidingEntityColliderY =
			collidingEntityCollider.y + collidingEntityCollider.height * 0.5

		let pushX
		let pushY

		if (centerCollidingEntityColliderX < centerColliderX) {
			pushX = -overlapX
		}
		else {
			pushX = overlapX
		}

		if (centerCollidingEntityColliderY < centerColliderY) {
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
		if (this.between(collider, collidingEntity.sprite.collider)) {
			this.pushOutwards(collider, collidingEntity)
		}
	}
}
