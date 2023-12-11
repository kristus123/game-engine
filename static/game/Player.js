export class Player extends GameObject {
	constructor(mouse) {
		super(0, 0, 35, 50, 100, 10)

		this.p = new PrettyParticles()
		this.mouse = mouse

		this.explosion = Draw.sprite()

		this.inventory = new Inventory()

		this.gun = new Gun(this)

		mouse.addOnClick('shoot', mousePosition => {
			this.gun.shoot(mousePosition)
		})
	}

	onCollision(o) {
		if (o instanceof InventoryItem) {
			this.inventory.pickUp(o)
		}
	}

	update() {
	}

	draw(ctx) {
		super.draw(ctx)
		// Draw.player(ctx, this)
		// Draw.circle(ctx, this.x, this.y, 20, 'orange')

		this.inventory.draw(ctx)
		this.gun.draw(ctx)
		// this.explosion(ctx)
		// this.p.piss(ctx, this, this.mouse.position, this.mouse)
		// Draw.coordinates(ctx, this)
	}
}
