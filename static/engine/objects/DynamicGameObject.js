export class DynamicGameObject extends _GameObject {
	constructor(position) {
		super(position)

		this.velocity = new Velocity(this, 0, 0)

		Physics.apply(this)
	}

	resetVelocity() {
		this.velocity.x = 0
		this.velocity.y = 0
	}

	get movingLeft() {
		return this.velocity.x < -10
	}

	get movingRight() {
		return this.velocity.x > 10
	}

	get movingUp() {
		return this.velocity.y < -10
	}

	get movingDown() {
		return this.velocity.y > 10
	}

	get movingHorizontally() {
		return this.movingLeft || this.movingRight
	}

	get movingVertically() {
		return this.movingUp || this.movingDown
	}

	get direction() {
		if (this.movingLeft) {
			return 'left'
		}
		else if (this.movingRight) {
			return 'right'
		}
		else if (this.movingUp) {
			return 'up'
		}
		else if (this.movingDown) {
			return 'down'
		}
		else {
			return 'idle'
		}
	}

	// eslint-disable-next-line no-unused-vars
	onCollision(o) {
	}

	update() {
	}

	decreaseVelocity(multiplier = 0.5) {
		this.velocity.x *= multiplier
		this.velocity.y *= multiplier
	}

	moveTowards(x, speedMultiplier=1) {
		Move(this).towards(x, speedMultiplier)
	}

}
