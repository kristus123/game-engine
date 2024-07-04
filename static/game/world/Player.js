export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 2300, 8)

		this.position.width = 100
		this.position.height = 100

		this.keyboardEvent = new KeyboardEvent()

		this.keyboard = new Keyboard()

		this.gun = new Gun(this)

		this.flyingUp = new Sprite(this, '/static/assets/sprites/player_16x16.png', [
			{ x: 4, y: 3 },
			{ x: 5, y: 3 },
			{ x: 6, y: 3 },
			{ x: 7, y: 3 },
			{ x: 8, y: 3 },
		])

		this.e = new Key('e')

		this.piss = new LocalObjects()

		Audio.breathing()
		Audio.music()
	}

	update() {
		this.gun.update()

		if (this.e.down) {
			const x = this.position.copy()
			x.width = 1
			x.height = 1

			const p = new DynamicGameObject(x, 2000, 100)
			ForcePush(p).roughlyTowards(Mouse.position, 1)
			this.piss.add(p)
			console.log('piss is working, but velcoity stuff makes it weird')
		}

		this.piss.update()
	}

	draw(draw, guiDraw) {
		//draw.position(this)
		this.gun.draw(draw, guiDraw)

		draw.text(this.position.offset(0, -100), this.clientId, 'orange', 20)

		// draw.new_circle(this.mouse.position)

		this.flyingUp.draw(draw, guiDraw)
		this.piss.draw(draw, guiDraw)
	}
}
