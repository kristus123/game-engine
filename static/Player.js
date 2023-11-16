export class Player extends GameObject {
	constructor(mouse) {
		super(0, 0, 20, 20, 100, 10)

		this.p = new PrettyParticles()
		this.mouse = mouse
	}

	update() {

	}

	draw(ctx) {
		Draw.player(ctx, this)
		this.p.piss(ctx, this.x, this.y, this.mouse.currentMousePosition)
	}
}
