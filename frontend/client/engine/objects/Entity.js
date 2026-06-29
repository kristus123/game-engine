export class Entity {
	constructor(position) {
		this.position = position.copy()

		// you do not need to worry about deltatime when using force.
		// force is a one-off force applied, and dt is calculated in Physics.js
		this.force = { x: 0, y: 0 }

		this.velocity = { x: 0, y: 0 }

		this.weight = 1
		this.friction = 1

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

	decreaseVelocity(multiplier = 0.5) {
		this.velocity.x *= multiplier
		this.velocity.y *= multiplier
	}

	enforceCollision(collider) {
		Collision.applyCollisionBetween(collider, this)
	}

	touches(o) {
		return Collision.between(this.position, o)
	}

	coveredBy(container, padding = 0) {
		return Collision.coveredEntirely(container, this.position, padding)
	}

	touchesAny(list, condition= (o) => true) {
		for (const o of list) {
			if (Collision.between(this.position, o) && this != o && condition(o)) {
				return o
			}
		}

		return null
	}

	distance(o) {
		return Distance.between(this, o)
	}

	closest(objects) {
		if (objects.empty()) {
			return null
		}
		else {
			let closestObject = objects[0]

			for (const o of objects) {
				if (this.distance(closestObject) > this.distance(o)) {
					this.closestObject = o
				}
			}
		}


		return closestObject
	}

	closestWithin(distance, objects) {
		let closestObject = this.closest(objects)

		if (this.within(distance, closestObject)) {
			return closestObject
		}
		else {
			return null
		}

	}

	within(distance, o) {
		return Distance.within(distance, this, o) || this.touches(o)
	}

	withinAny(distance, objects) {
		for (const o of objects) {
			if (this.within(distance, o)) {
				return o
			}
		}
	}

	notWithin(distance, o) {
		return Distance.notWithin(distance, this, o)
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

	update() {
		D1.rectangle(this)
	}

	moveTo(position, multiplier=1) {
		const dir = Math.atan2(position.y - this.y, position.x - this.x)

		this.x += Math.cos(dir) * multiplier * DeltaTime.value
		this.y += Math.sin(dir) * multiplier * DeltaTime.value
	}

	moveTowards(position, speed) {
		const dx = position.x - this.x
		const dy = position.y - this.y
		const dist = Math.hypot(dx, dy)
		if (dist > 5) {
			this.x += (dx / dist) * speed * DeltaTime.value
			this.y += (dy / dist) * speed * DeltaTime.value
			return false
		}
		else {
			this.x = position.x
			this.y = position.y
			return true
		}
	}

	moveAway(position, multiplier=1) {
		const dir = Math.atan2(this.y - position.y, this.x - position.x)

		this.x += Math.cos(dir) * multiplier * DeltaTime.value
		this.y += Math.sin(dir) * multiplier * DeltaTime.value
	}

	pushTo(position, multiplier=1) {
		const dir = Math.atan2(position.y - this.y, position.x - this.x)

		this.force.x += Math.cos(dir) * multiplier
		this.force.y += Math.sin(dir) * multiplier
	}

	pushAway(position, multiplier=1) {
		const dir = Math.atan2(this.y - position.y, this.x - position.x)

		this.force.x += Math.cos(dir) * multiplier
		this.force.y += Math.sin(dir) * multiplier
	}

	forcePushTo(position, multiplier=1) {
		const dir = Math.atan2(position.y - this.y, position.x - this.x)

		this.velocity.x += Math.cos(dir) * multiplier * DeltaTime.value
		this.velocity.y += Math.sin(dir) * multiplier * DeltaTime.value
	}

	forcePushAway(position, multiplier=1) {
		const dir = Math.atan2(this.y - position.y, this.x - position.x)

		this.velocity.x += Math.cos(dir) * multiplier * DeltaTime.value
		this.velocity.y += Math.sin(dir) * multiplier * DeltaTime.value
	}

}
