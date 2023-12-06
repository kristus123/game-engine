export class Spaceship extends GameObject {
	constructor(mouse) {
		super(-500, 0, 300, 300, 10, 25)
		this.mouse = mouse
		this.prettyParticles = new PrettyParticles()
		this.picture = new Picture(this, 'https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png')
		this.splash = new Splash()

		mouse.addOnClick('shoot cum', mousePosition => {
			this.splash.splash(this.position.center, mousePosition)
		})
	}

	update() {}

	draw(ctx) {
		this.splash.draw(ctx)
		// this.prettyParticles.updateAndDraw(ctx, this.x, this.y)
		// Draw.spaceship(ctx, this)
		// Draw.new_circle(ctx, this.position.center)
		this.picture.r(ctx)
	}
}
