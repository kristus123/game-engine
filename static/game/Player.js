export class Player extends GameObject {
	constructor(mouse, controller) {
		super(-1200, 10, 35, 50, 200, 5)

		this.mouse = mouse
		this.controller = controller

		this.keypressEvent = new KeyboardEvents()
		this.explosion = Draw.sprite()
		this.gun = new Gun(this)

		this.splash = new Splash()
		this.charge = 100

		mouse.addOnClick('shoot', mousePosition => {
			this.gun.shoot(mousePosition)
		})

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
		Draw.splash(ctx, this.position, this.mouse.position, 50)

		Draw.player(ctx, this)

		this.gun.draw(ctx)
		
		this.splash.draw(ctx)
	}
}
