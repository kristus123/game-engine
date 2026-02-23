export class Entity extends _GameObject {
	constructor(position) {
		super(position)

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
			return "left"
		}
		else if (this.movingRight) {
			return "right"
		}
		else if (this.movingUp) {
			return "up"
		}
		else if (this.movingDown) {
			return "down"
		}
		else {
			return "idle"
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

	// Move class refactor functions
	moveTowards(position, speedMultiplier=1) {
		const dir = Math.atan2(position.y - this.y, position.x - this.x)
		this.x += Math.cos(dir) * 10 * speedMultiplier
		this.y += Math.sin(dir) * 10 * speedMultiplier
	}

	moveAwayFrom(position, speedMultiplier=1) {
		const dir = Math.atan2(this.y - position.y, this.x - position.x)
		this.x += Math.cos(dir) * 10 * speedMultiplier
		this.y += Math.sin(dir) * 10 * speedMultiplier
	}


	moveTo(position, speedMultiplier=1) {
		const dir = Math.atan2(position.y - this.y, position.x - this.x)
		const offsetDir = dir + (degreesOffset * Math.PI / 180) // Apply the offset in radians
		this.x += Math.cos(offsetDir) * 10 * speedMultiplier
		this.y += Math.sin(offsetDir) * 10 * speedMultiplier
	}

	// Push class refactor functions
	pushAwayFrom(position, speedMultiplier=1) {
		const dir = Math.atan2(this.y - position.y, this.x - position.x)
		this.velocity.x += Math.cos(dir) * 100 * speedMultiplier
		this.velocity.y += Math.sin(dir) * 100 * speedMultiplier
	}

	pushTowards(position, multiplier=1) {
		const dir = Math.atan2(position.y - this.y, position.x - this.x)
		this.force.x += (Math.cos(dir) * 1 * multiplier)
		this.force.y += (Math.sin(dir) * 1 * multiplier)
	}

	// ForcePush class refactor functions
	forcePushAwayFrom(position, speedMultiplier=1) {
		const dir = Math.atan2(this.y - position.y, this.x - position.x)
		this.velocity.x = Math.cos(dir) * 10 * speedMultiplier
		this.velocity.y = Math.sin(dir) * 10 * speedMultiplier
	}

	forcePushTowards(position, speedMultiplier=1) {
		const dir = Math.atan2(position.y - this.y, position.x - this.x)
		this.velocity.x = Math.cos(dir) * 10 * speedMultiplier
		this.velocity.y = Math.sin(dir) * 10 * speedMultiplier
	}

	forcePushRandomly(speedMultiplier=1) {
		const position = {
			x: this.x + Random.integerBetween(-10, 10),
			y: this.y + Random.integerBetween(-10, 10),
		}
		const dir = Math.atan2(position.y - this.y, position.x - this.x)
		this.velocity.x = Math.cos(dir) * 10 * speedMultiplier
		this.velocity.y = Math.sin(dir) * 10 * speedMultiplier
	}

	forcePushRoughlyTowards(position, speedMultiplier=1) {
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

		this.forcePushTowards(p, speedMultiplier)
	}
}
