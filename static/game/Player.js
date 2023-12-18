export class Player extends GameObject {
	constructor(mouse, controller) {
		super(0, 0, 35, 50, 200, 5)

		this.thing = new GameObject(0, 0, 10, 10, 200, 5)

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

				Push(this).towards(p, 200)

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
		Draw.splash(ctx, this.position, this.mouse.position, 200)
		if (Draw.isObjectWithinTheAngle(this.thing, this.position, this.mouse.position, 200)) {
			console.log("within!")
			Draw.new_text(ctx, this.thing.position, 'heiiiiiiiiiiiiiiiiiiiiiiiiiii')
		} else {
			Draw.new_text(ctx, this.thing.position, 'point at me')
		}

		super.draw(ctx)
		this.thing.draw(ctx)
		Draw.player(ctx, this)

		this.inventory.draw(ctx)
		this.gun.draw(ctx)
		
		Draw.hpBar(ctx, this.position, this.charge, 100)

		this.splash.draw(ctx)
	}
}
