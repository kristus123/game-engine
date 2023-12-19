export class Controller {
	constructor(objectToControl) {
		this.objectToControl = objectToControl
		this.keyboard = new Keyboard()

		this.velocity = {
			x: 0,
			y: 0,
		}
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
			this.objectToControl.velocity.x += this.objectToControl.velocityFactor
		}

		this.velocity.x = this.keyboard.right ? 1 : this.keyboard.left ? -1 : 0
		this.velocity.y = this.keyboard.down ? 1 : this.keyboard.up ? -1 : 0
	}

	control(o) {
		this.objectToControl = o
	}
}
