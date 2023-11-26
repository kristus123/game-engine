export class Player extends GameObject {
	constructor(mouse) {
		super(0, 0, 35, 50, 100, 10)

		this.p = new PrettyParticles()
		this.mouse = mouse

		this.explosion = Draw.sprite()

		this.inventory = new Inventory()
	}

	onCollision(o) {
		if (o instanceof InventoryItem) {
			this.inventory.pickUp(o)
		}
	}

	update() {
	}

	draw(ctx) {
		Draw.player(ctx, this)
		this.explosion(ctx)
		// this.p.piss(ctx, this.x, this.y, this, this.mouse.currentMousePosition, this.mouse)
		// Draw.coordinates(ctx, this)
		super.draw(ctx)
	}
}
