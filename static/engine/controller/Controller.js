export class Controller {
	constructor() {
		this.keyboard = new Keyboard()

		this.velocity = {
			x: 0,
			y: 0,
		}

		this.objectToControl = null
	}

	control(o) {
		this.objectToControl = o
	}

	update() {
		if (this.keyboard.up) {
			this.objectToControl.velocity.y -= this.objectToControl.velocityFactor
		}

		if (this.keyboard.down) {
			this.objectToControl.velocity.y += this.objectToControl.velocityFactor
		}

		if (this.keyboard.left) {
			this.objectToControl.velocity.x -= this.objectToControl.velocityFactor
		}

		if (this.keyboard.right) {
			// this.objectToControl.velocity.x += this.objectToControl.velocityFactor
			Push(this.objectToControl).towards(this.objectToControl.position.offset(1000, 0))
		}

		this.velocity.x = this.keyboard.right ? 1 : this.keyboard.left ? -1 : 0
		this.velocity.y = this.keyboard.down ? 1 : this.keyboard.up ? -1 : 0
	}

}
