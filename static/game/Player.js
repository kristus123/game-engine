export class Player extends GameObject {
	constructor(mouse, keyboard) {
		super(0, 0, 35, 50, 100, 10)
		this.keyboard = keyboard
		// super(0, 0, 35, 50, 100, 10)

		this.p = new PrettyParticles()
		this.mouse = mouse

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


				const p = this.position.copy()
				p.x -= this.velocity.x / 1
				p.y -= this.velocity.y / 1

				this.velocity.x *=2
				this.velocity.y *=2

				this.splash.splash(this.position, p)
				console.log('hei')
				
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
		// Draw.circle(ctx, this.x, this.y, 20, 'orange')

		this.inventory.draw(ctx)
		this.gun.draw(ctx)
		// this.explosion(ctx)
		// this.p.piss(ctx, this, this.mouse.position, this.mouse)
		// Draw.coordinates(ctx, this)
		


		Draw.hpBar(ctx, this.position, this.charge, 100)

		this.splash.draw(ctx)
	}
}
