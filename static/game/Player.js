export class Player extends GameObject {
	constructor(mouse) {
		super(-1200, 10, 35, 50, 200, 5)

		this.mouse = mouse

		this.keyboardEvent = new KeyboardEvent()
		this.explosion = Draw.sprite()

		this.splash = new Splash()
		this.charge = 100

		this.keyboardEvent.addKeyDownListener('e', () => {
			if (this.charge >= 100) {
				this.charge -= 100
				Push(this).towards(this.mouse.position, 200)
			}
		})

		this.keyboardEvent.addKeyDownListener('b', () => {
			if (!this.beacon) {
				this.beacon = new BeaconShit(this.mouse.position)
			}
		})

		setInterval(() => {
			this.charge += 1
		}, 20)

		this.offsetPosition = this.position.offset(100, 100)
	}

	// onCollision(o) {
	// 	if (o instanceof InventoryItem) {
	// 		this.inventory.pickUp(o)
	// 	}
	// }

	update() {
		this.charge += 1
		if (this.beacon) {
			this.beacon.update()
		}

	}

	draw(ctx) {
		Draw.new_circle(ctx, this.offsetPosition)
		Draw.player(ctx, this)

		if (this.beacon) {
			this.beacon.draw(ctx)
		}

		this.splash.draw(ctx)
	}
}
