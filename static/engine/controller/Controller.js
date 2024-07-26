export class Controller {
	static keyboard = new Keyboard()

	static velocity = new Velocity(this)

	static disabled = false

	static objectToControl = null

	static control(o) {
		this.objectToControl = o
	}

	// todo fix deltatime bug here
	// this is the reason why it goes twice as fast on 120 fps
	static update() {
		if (!this.objectToControl || this.disabled) {
			return
		}

		if (this.keyboard.up) {
			this.objectToControl.velocity.y -= this.objectToControl.velocityFactor
		}
		else if (!this.keyboard.down) {
			this.objectToControl.velocity.y = 0
		}

		if (this.keyboard.down) {
			this.objectToControl.velocity.y += this.objectToControl.velocityFactor
		}
		else if (!this.keyboard.up) {
			this.objectToControl.velocity.y = 0
		}

		if (this.keyboard.left) {
			this.objectToControl.velocity.x -= this.objectToControl.velocityFactor
		}
		else if (!this.keyboard.right) {
			this.objectToControl.velocity.x = 0
		}

		if (this.keyboard.right) {
			this.objectToControl.velocity.x += this.objectToControl.velocityFactor
			// ForcePush(this.objectToControl).towards(this.objectToControl.position.offset(1000, 0), 10)
		}
		else if (!this.keyboard.left) {
			this.objectToControl.velocity.x = 0
		}

		this.velocity.x = this.keyboard.right ? 1 : this.keyboard.left ? -1 : 0
		this.velocity.y = this.keyboard.down ? 1 : this.keyboard.up ? -1 : 0
	}

	static draw(draw, guiDraw) {
	}

}
