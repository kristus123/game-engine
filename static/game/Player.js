export class Player extends GameObject {
	constructor(mouse) {
		super(0, 10, 40, 50, 200, 8)

		this.mouse = mouse

		this.keyboardEvent = new KeyboardEvent()

		this.splash = new Splash()
		this.charge = 100

		this.keyboard = new Keyboard()

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

		this.flyingUp = new Sprite(this, '/static/assets/player.png', 16, 16, 5, [
			{ x: 4, y: 3 },
			{ x: 5, y: 3 },
			{ x: 6, y: 3 },
			{ x: 7, y: 3 },
			{ x: 8, y: 3 },
		])

		this.flyingDown = new Sprite(this, '/static/assets/player.png', 16, 16, 5, [
			{ x: 4, y: 0 },
			{ x: 5, y: 0 },
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
			{ x: 8, y: 0 },
		])

		this.flyingRight = new Sprite(this, '/static/assets/player.png', 16, 16, 5, [
			{ x: 4, y: 2 },
			{ x: 5, y: 2 },
			{ x: 6, y: 2 },
			{ x: 7, y: 2 },
			{ x: 8, y: 2 },
		])
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

		if (this.keyboard.up) {
			this.flyingUp.draw(draw)
			this.splash.splash(this.position.offset(40, 50), this.position.offset(0, 200), 1, 'white', 20, 100)
			this.splash.draw(draw)
		}
		else if (this.keyboard.down) {
			this.splash.draw(draw)
			this.flyingDown.draw(draw)
			this.splash.splash(this.position.offset(40, 50), this.position.offset(0, -200), 1, 'white', 20, 100)
		}
		else if (this.keyboard.left) {
			this.splash.splash(this.position.offset(40, 50), this.position.offset(200, 0), 1, 'white', 20, 100)
			this.splash.draw(draw)
			this.flyingRight.mirror(draw)
		}
		else if (this.keyboard.right) {
			this.splash.splash(this.position.offset(40, 50), this.position.offset(-200, 0), 1, 'white', 20, 100)
			this.splash.draw(draw)
			this.flyingRight.draw(draw)
		}
		else {
			this.flyingDown.draw(draw)
			this.splash.draw(draw)
		}




	}
}
