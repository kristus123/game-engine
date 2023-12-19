export class Player extends GameObject {
	constructor(mouse, controller) {
		super(-500, 10, 35, 50, 200, 5)

		this.piss = new Piss(this, mouse)

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

				p = this.position.copy()
				p.x -= this.velocity.x * 1000
				p.y -= this.velocity.y * 1000

				this.splash.splash(this.position, p)
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

		this.piss.draw(ctx)

		super.draw(ctx)
		Draw.player(ctx, this)

		this.gun.draw(ctx)
		
		// Draw.hpBar(ctx, this.position, this.charge, 100)

		this.splash.draw(ctx)

		const p = this.position.copy()
		p.x += this.controller.velocity.x * 100
		p.y += this.controller.velocity.y * 100
		Draw.new_circle(ctx, p)
	}
}
