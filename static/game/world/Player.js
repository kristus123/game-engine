export class Player extends DynamicGameObject {
	constructor(mouse) {
		super(-120, 10, 40, 50, 2300, 8)

		this.keyboardEvent = new KeyboardEvent()

		this.splash = new Splash()
		this.charge = 100

		this.keyboard = new Keyboard()

		this.keyboardEvent.addKeyDownListener('e', () => {
			if (this.charge >= 100) {
				this.charge -= 100
				ForcePush(this).towards(this.mouse.position, 100)
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

	draw(draw, guiDraw) {
		// draw.revertMouse(this, this.mouse.position)

			this.flyingUp.draw(draw, guiDraw)
		// if (this.keyboard.up) {
		// 	this.flyingUp.draw(draw, guiDraw)
		// 	// this.splash.splash(this.position.offset(40, 50), this.position.offset(0, 200), 1, 'white', 1, 100)
		// 	this.splash.draw(draw, guiDraw)
		// }
		// else if (this.keyboard.down) {
		// 	this.splash.draw(draw, guiDraw)
		// 	this.flyingDown.draw(draw, guiDraw)
		// 	// this.splash.splash(this.position.offset(40, 50), this.position.offset(0, -200), 1, 'white',1, 100)
		// }
		// else if (this.keyboard.left) {
		// 	// this.splash.splash(this.position.offset(40, 50), this.position.offset(200, 0), 1, 'white', 1, 100)
		// 	this.splash.draw(draw, guiDraw)
		// 	this.flyingRight.mirror(draw)
		// }
		// else if (this.keyboard.right) {
		// 	// this.splash.splash(this.position.offset(40, 50), this.position.offset(-200, 0), 1, 'white', 1, 100)
		// 	this.splash.draw(draw, guiDraw)
		// 	this.flyingRight.draw(draw, guiDraw)
		// }
		// else {
		// 	this.flyingDown.draw(draw, guiDraw)
		// 	this.splash.draw(draw, guiDraw)
		// }
	}
}
