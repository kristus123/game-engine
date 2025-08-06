import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Velocity } from '/static/engine/objects/Velocity.js'; 
import { _GameObject } from '/static/engine/objects/_GameObject.js'; 
import { Collision } from '/static/engine/physics/Collision.js'; 
import { Physics } from '/static/engine/physics/Physics.js'; 

export class DynamicGameObject extends _GameObject {
	constructor(position, weight, velocityFactor) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(weight, "argument weight in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(velocityFactor, "argument velocityFactor in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.weight = weight; 
		this.velocityFactor = velocityFactor; 


		this.velocity = new Velocity(this, 0, 0)

		Physics.global.applyPhysics(this)
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

	// eslint-disable-next-line no-unused-vars
	onCollision(o) {
	}

	update() {
	}

	decreaseVelocity(multiplier = 0.5) {
		this.velocity.x *= multiplier
		this.velocity.y *= multiplier
	}

}
