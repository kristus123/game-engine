export class Spaceship extends GameObject {
	constructor(mouse) {
		super(-500, 0, 300, 300, 10, 25)
		this.mouse = mouse
		this.prettyParticles = new PrettyParticles()
		this.picture = new Picture(this, 'https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png')
		this.splash = new Splash()

		this.mouseHoldingSpaceship = false

		// mouse.addOnClick('shoot cum', this.mouse.position => {
		// 	this.splash.splash(this.position.center, this.mouse.position)
		// })
		//
		//


	}

	update() {
		this.mouse.position

	}

	draw(ctx) {
		this.splash.draw(ctx)
		// this.prettyParticles.updateAndDraw(ctx, this.x, this.y)
		// Draw.spaceship(ctx, this)
		// Draw.new_circle(ctx, this.position.center)
		this.picture.r(ctx)

		if (
			this.mouse.position.x >= this.x &&
			this.mouse.position.x <= this.x + this.width &&
			this.mouse.position.y >= this.y &&
			this.mouse.position.y <= this.y + this.height
		) {
			if (this.mouse.down) {
				this.mouseHoldingSpaceship = true
			}
		}
		else {
		}

		if (this.mouseHoldingSpaceship) {
			this.x = this.mouse.position.x - this.width/2
			this.y = this.mouse.position.y - this.height/2
		}
		if (this.mouse.up) {
			this.mouseHoldingSpaceship = false
		}

	}
}
