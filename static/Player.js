class Player extends GameObject {
	constructor() {
		super(786, 346, 20, 20)
		this.keyboard = new Keyboard()
		this.grounded = false
	}

	update() {
		if (this.keyboard.up) {
			this.velocity.y -= 1.5
		}
		else {
			this.velocity.y = 0
		}

		if (this.keyboard.left) {
			this.velocity.x -= 1.5
		}
		else if (this.keyboard.right) {
			this.velocity.x += 1.5
		}
		else {
			this.velocity.x = 0
		}

		super.update()
	}
}

