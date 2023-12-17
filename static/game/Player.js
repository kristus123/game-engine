export class Player extends GameObject {
	constructor(mouse, controller) {
		super(0, 0, 35, 50, 100, 10)
		this.mouse = mouse
		this.controller = controller

		this.keypressEvent = new KeyboardEvents()
		this.explosion = Draw.sprite()
		this.inventory = new Inventory()
		this.gun = new Gun(this)

		this.splash = new Splash()
		this.charge = 100

		mouse.addOnClick('shoot', mousePosition => {
			this.gun.shoot(mousePosition)
		})

		this.keypressEvent.addKeyDownListener('e', () => {
			if (this.charge == 100) {
				this.charge = 0

				let p = this.position.copy()
				p.x += this.velocity.x * 1000
				p.y += this.velocity.y * 1000

				Push(this).towards(p, 80)

				p = this.position.copy()
				p.x -= this.velocity.x * 1000
				p.y -= this.velocity.y * 1000

				this.splash.splash(this.position, p)
			}
		})

		setInterval(() => {
			if (this.charge < 100) {
				this.charge += 1
			}
		}, 10)
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
		Draw.player(ctx, this)

		this.inventory.draw(ctx)
		this.gun.draw(ctx)
		
		Draw.hpBar(ctx, this.position, this.charge, 100)

		this.splash.draw(ctx)
	}
}
