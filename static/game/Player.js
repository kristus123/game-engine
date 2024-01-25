export class Player extends GameObject {
	constructor(mouse) {
		super(-120, 10, 40, 50, 200, 5)

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

		this.picture = new Picture(this, 'https://www.nicepng.com/png/full/343-3434119_overworld-pokemon-trainer-fusion-with-hydreigon-pokemon-red.png')
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

	draw(draw) {
		// console.log(this.x + " " + this.y)
		this.picture.draw(draw)

		if (this.beacon) {
			this.beacon.draw(draw)
		}

		this.splash.draw(draw)
	}
}
