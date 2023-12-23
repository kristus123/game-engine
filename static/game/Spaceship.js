export class Spaceship extends GameObject {
	constructor(mouse) {
		super(-4000, 0, 300, 300, 10, 25)
		this.mouse = mouse
		this.picture = new Picture(this, 'https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png')

		this.mouseHoldingSpaceship = false
	}

	update() {
	}

	draw(ctx) {
		this.picture.r(ctx)

		// if (Collision.between(this.position, this.mouse.position) && this.mouse.down) {
		// 	this.mouseHoldingSpaceship = true
		// }

		// if (this.mouseHoldingSpaceship) {
		// 	this.x = this.mouse.position.x - this.width/2
		// 	this.y = this.mouse.position.y - this.height/2
		// }

		// if (this.mouse.up) {
		// 	this.mouseHoldingSpaceship = false
		// }

	}
}
