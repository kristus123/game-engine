export class GameObject {
	constructor(_x, _y, _width, _height, weight, velocityFactor) {

		this.position = new Position(_x, _y, _width, _height)

		this.velocity = new Velocity(this, 0, 0)

		Physics.global.applyPhysics(this)
	}

	// eslint-disable-next-line no-unused-vars
	onCollision(o) {
	}

	resetVelocity() {
		this.velocity.x = 0
		this.velocity.y = 0
	}

	update() { }

	draw(draw, guiDraw) {
		draw.new_rectangle(this.position)
	}

	followIfOutsideOfRadius(o, radius) {
		if (Distance.between(this, o) > radius) {
			const angle = Math.atan2(o.y - this.y, o.x - this.x)

			this.x = o.x - radius * Math.cos(angle)
			this.y = o.y - radius * Math.sin(angle)
		}
	}

	get x() {
		return this.position.x
	}

	get y() {
		return this.position.y
	}

	set x(x) {
		this.position.x = x
	}

	set y(y) {
		this.position.y = y
	}

	get width() {
		return this.position.width
	}

	get height() {
		return this.position.height
	}

	set width(w) {
		this.position.width = w
	}

	set height(h) {
		this.position.height = h
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

}
