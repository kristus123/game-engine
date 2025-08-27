export class DynamicGameObject extends _GameObject {
	constructor(position, options = {}) {
		super(position)

		this.velocity = new Velocity(this, 0, 0)
		this.speed = options.speed || 10
		this.movementThreshold = options.movementThreshold || 10
		this.deceleration = options.deceleration || 0.5

		Physics.apply(this)
	}

	get movingLeft() { return this.velocity.x < -10 }

	get movingRight() { return this.velocity.x > 10 }

	get movingUp() { return this.velocity.y < -10 }

	get movingDown() { return this.velocity.y > 10 }

	get movingHorizontally() { return this.movingLeft || this.movingRight }

	get movingVertically() { return this.movingUp || this.movingDown }

	get direction() {
		if (this.movingLeft) return 'left'
		else if (this.movingRight) return 'right'
		else if (this.movingUp) return 'up'
		else if (this.movingDown) return 'down'
		else return 'idle'
	}

	// eslint-disable-next-line no-unused-vars
	onCollision(o) {
	}

	update() {
	}

	resetVelocity() {
		this.velocity.x = 0
		this.velocity.y = 0
	}

	// Movement Methods
	moveAwayFrom(position, multiplier = 1) {
		const dir = Math.atan2(this.y - position.y, this.x - position.x)
		this.applyMovement(dir, multiplier)
	}

	moveTowards(position, multiplier = 1) {
		const dir = Math.atan2(position.y - this.y, position.x - this.x)
		this.applyMovement(dir, multiplier)
	}

	moveTo(position, degreesOffset, multiplier = 1) {
		const dir = Math.atan2(position.y - this.y, position.x - this.x)
		const offsetDir = dir + (degreesOffset * Math.PI / 180) // Apply the offset in radians
		this.applyMovement(offsetDir, multiplier)
	}

	moveRandomly(multiplier=1) {
		const position = {
			x: this.x + Random.integerBetween(-10, 10),
			y: this.y + Random.integerBetween(-10, 10),
		}
		const dir = Math.atan2(position.y - this.y, position.x - this.x)

		this.applyMovement(dir, multiplier)
	}

	moveRoughlyTowards(position, multiplier=1) {
		const angleSpread = 0.9

		const direction_x = position.x - this.x
		const direction_y = position.y - this.y

		const initialAngle = Math.atan2(direction_y, direction_x)
		const spread = Random.floatBetween(-angleSpread / 2, angleSpread / 2)
		const angle = initialAngle + spread

		const p = {
			x: Math.cos(angle) * Random.floatBetween(1, 5),
			y: Math.sin(angle) * Random.floatBetween(1, 5),
		}

		this.moveTowards(p, multiplier)
	}

	applyMovement(direction, multiplier = 1) {
		this.x += Math.cos(direction) * this.speed * multiplier
		this.y += Math.sin(direction) * this.speed * multiplier
	}

	decreaseVelocity(multiplier = this.deceleration) {
		this.velocity.x *= multiplier
		this.velocity.y *= multiplier
	}
}
