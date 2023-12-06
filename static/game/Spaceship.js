export class Spaceship extends GameObject {
	constructor() {
		super(-500, 0, 300, 300, 10, 25)
		this.prettyParticles = new PrettyParticles()
		this.picture = new Picture(this, 'https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png')
	}

	update() {}

	draw(ctx) {
		// this.prettyParticles.updateAndDraw(ctx, this.x, this.y)
		// Draw.spaceship(ctx, this)
		// Draw.new_circle(ctx, this.position.center)
		super.draw(ctx)
		this.picture.r(ctx)
	}
}
