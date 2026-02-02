export class Controller {

	static init() {
		this.velocity = Velocity(this)
		this.disabled = false
		this.objectToControl = null
	}


	static control(o) {
		this.objectToControl = o
		this.velocity.object = o
	}


	static disable(amountInMs) {
		this.disabled = true

		setTimeout(() => {
			this.disabled = false
		}, amountInMs)

	}

	// todo fix deltatime bug here
	// this is the reason why it goes twice as fast on 120 fps
	static update() {
		const xxx = 2
		if (!this.objectToControl || this.disabled) {
			return
		}

		if (Keyboard.up) {
			this.objectToControl.velocity.y = -xxx
		}
		else if (!Keyboard.down) {
			this.objectToControl.velocity.y = 0
		}

		if (Keyboard.down) {
			this.objectToControl.velocity.y = xxx
		}
		else if (!Keyboard.up) {
			this.objectToControl.velocity.y = 0
		}

		if (Keyboard.left) {
			this.objectToControl.velocity.x = -xxx
		}
		else if (!Keyboard.right) {
			this.objectToControl.velocity.x = 0
		}

		if (Keyboard.right) {
			this.objectToControl.velocity.x = xxx
			// ForcePush(this.objectToControl).towards(this.objectToControl.position.offset(1000, 0), 10)
		}
		else if (!Keyboard.left) {
			this.objectToControl.velocity.x = 0
		}

		this.velocity.x = Keyboard.right ? 1 : Keyboard.left ? -1 : 0
		this.velocity.y = Keyboard.down ? 1 : Keyboard.up ? -1 : 0
	}

}
