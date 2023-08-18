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
		// causes flickering
		const image = new Image();
		image.src = "https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png";

		ctx.save();

		ctx.translate(this.x, this.y);
		const rotationAngle = Math.atan2(this.velocity.y, this.velocity.x);
		ctx.rotate(rotationAngle);
		ctx.rotate(Math.PI / 2); // 90 degrees

		ctx.drawImage(image, -image.width / 2, -image.height / 2);
		
		ctx.restore();
	}
}

