class Player extends GameObject {
	constructor() {
		super(786, 0, 20, 20)
		this.keyboard = new Keyboard()
		this.grounded = false
	}

	update() {
		if (this.keyboard.up) {
			this.velocity.y -= 20
		}

		if (this.keyboard.down) {
			this.velocity.y += 20
		}

		if (this.keyboard.left) {
			this.velocity.x -= 20
		}
		if (this.keyboard.right) {
			this.velocity.x += 20
		}
	}

	draw(ctx) {
		Draw.image(ctx, this)
	}
}

