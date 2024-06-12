export class DynamicGameObject extends _GameObject {
	constructor(position, weight, velocityFactor, imagePath='nullable') {
		super(position, imagePath)

		this.velocity = new Velocity(this, 0, 0)

		Physics.global.applyPhysics(this)
	}

	resetVelocity() {
		this.velocity.x = 0
		this.velocity.y = 0
	}

	get movingLeft() {
		return this.velocity.x < -20
	}

	get movingRight() {
		return this.velocity.x > 20
	}

	get movingUp() {
		return this.velocity.y < -20
	}

	get movingDown() {
		return this.velocity.y > 20
	}

	get movingHorizontally() {
		return this.movingLeft || this.movingRight
	}

	get movingVertically() {
		return this.movingUp || this.movingDown
	}

	// eslint-disable-next-line no-unused-vars
	onCollision(o) {
	}

	update() {
	}


}
