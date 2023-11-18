export class Player extends GameObject {
	constructor(mouse) {
		super(0, 0, 35, 50, 100, 10)

		this.p = new PrettyParticles()
		this.mouse = mouse
	}

	update() {
		Calculate.objectThatIsCirclingAroundObjectBasedOnMousePosition(ctx, this, this.mouse.currentMousePosition)
	}

	draw(ctx) {
		Calculate.objectThatIsCirclingAroundObjectBasedOnMousePosition(ctx, this, this.mouse.currentMousePosition)

		Draw.player(ctx, this)
		this.p.piss(ctx, this.x, this.y, this, this.mouse.currentMousePosition, this.mouse)
	}
}
