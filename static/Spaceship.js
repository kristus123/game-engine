export class Spaceship extends GameObject {
	constructor() {
		super(-500, 0, 100, 100, 10, 25)
		this.prettyParticles = new PrettyParticles()
	}

	update() {}

	draw(ctx) {
		// this.prettyParticles.updateAndDraw(ctx, this.x, this.y)
		Draw.spaceship(ctx, this)
	}
}
