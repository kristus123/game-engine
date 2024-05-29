export class Player extends DynamicGameObject {
	constructor(mouse) {
		super(new Position(0, 0, 40, 50), 2300, 8)

		this.keyboardEvent = new KeyboardEvent()

		this.splash = new Splash()
		this.charge = 100

		this.keyboard = new Keyboard()

		this.gun = new Gun(this, mouse)

		// this.keyboardEvent.addKeyDownListener('e', () => {
		// 	if (this.charge >= 100) {
		// 		this.charge -= 100
		// 		ForcePush(this).towards(this.mouse.position, 100)
		// 	}
		// })

		// this.keyboardEvent.addKeyDownListener('b', () => {
		// 	if (!this.beacon) {
		// 		this.beacon = new BeaconShit(this.mouse.position)
		// 	}
		// })

		setInterval(() => {
			this.charge += 1
		}, 20)

		this.flyingUp = new Sprite(this, '/static/assets/sprites/player_16x16.png', 5, [
			{ x: 4, y: 3 },
			{ x: 5, y: 3 },
			{ x: 6, y: 3 },
			{ x: 7, y: 3 },
			{ x: 8, y: 3 },
		])
	}

	update() {
		this.gun.update()
		this.charge += 1
		if (this.beacon) {
			this.beacon.update()
		}

	}

	draw(draw, guiDraw) {
		draw.position(this)
		this.gun.draw(draw, guiDraw)

		draw.new_text(this.position.offset(0, -100), this.clientId, 'orange', 20)

		// draw.new_circle(this.mouse.position)

		this.flyingUp.draw(draw, guiDraw)
	}
}