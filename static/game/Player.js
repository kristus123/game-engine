export class Player extends GameObject {
	constructor(mouse, controller) {
		super(-1200, 10, 35, 50, 200, 5)

		this.mouse = mouse
		this.controller = controller

		this.keypressEvent = new KeyboardEvents()
		this.explosion = Draw.sprite()

		this.splash = new Splash()
		this.charge = 100

		this.keypressEvent.addKeyDownListener('e', () => {
			if (this.charge >= 100) {
				this.charge -= 100
				Push(this).towards(this.mouse.position, 200)
			}
		})

		setInterval(() => {
			this.charge += 1
		}, 20)
	}

	// onCollision(o) {
	// 	if (o instanceof InventoryItem) {
	// 		this.inventory.pickUp(o)
	// 	}
	// }

	update() {
		this.charge += 1
	}

	draw(ctx) {
		Draw.player(ctx, this)

		
		this.splash.draw(ctx)
	}
}
