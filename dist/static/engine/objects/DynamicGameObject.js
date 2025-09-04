import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Velocity } from '/static/engine/objects/Velocity.js'; 
import { _GameObject } from '/static/engine/objects/_GameObject.js'; 
import { Collision } from '/static/engine/physics/Collision.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Move } from '/static/engine/physics/Move.js'; 
import { Physics } from '/static/engine/physics/Physics.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

export class DynamicGameObject extends _GameObject {
	constructor(position) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


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

	// Move class refactor functions
	moveAwayFrom(o, speedMultiplier=1) {
		Move(this).awayFrom(o, speedMultiplier)
	}


	moveTo(o, speedMultiplier=1) {
    	Move(this).towards(o, speedMultiplier)
	}

	// Push class refactor functions
	pushAwayFrom(o, speedMultiplier=1) {
    	Push(this).awayFrom(o, speedMultiplier)
	}

	pushTowards(o, speedMultiplier=1) {
		Push(this).towards(o, speedMultiplier)
	}

	// ForcePush class refactor functions
	forcePushAwayFrom(o, speedMultiplier=1) {
    	ForcePush(this).awayFrom(o, speedMultiplier)
	}

	forcePushTowards(o, speedMultiplier=1) {
    	ForcePush(this).towards(o, speedMultiplier)
	}

	forcePushRandomly(o, speedMultiplier=1) {
    	ForcePush(this).randomly(o, speedMultiplier)
	}

	forcePushRoughlyTowards(o, speedMultiplier=1) {
    	ForcePush(this).roughlyTowards(o, speedMultiplier)
	}
}
