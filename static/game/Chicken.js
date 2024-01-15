export class Chicken extends GameObject {
	constructor(player) {
		super(-1800, -200, 150, 150, 10, 10)
		this.player = player

		const frameWidth = 32
		const frameHeight = 32
		const scale = 5

		const frameSequence = [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		]

		this.sprite = new Sprite(this, '/static/assets/Chicken_Sprite_Sheet.png', frameWidth, frameHeight, scale, frameSequence)
	}

	onCollision(o) {
		this.runAll.remove(this)

		const splash = new Splash()
		splash.splashOpposite(this.position.center, this.player.position.center, 0.7, 'red')
		this.runAll.add(splash)
		setTimeout(() => {
			this.runAll.remove(splash)
		}, 10_000)

		// Push(this).awayFrom(o, 50)
	}

	update() {
	}

	draw(ctx) {
		// super.draw(ctx)
		this.sprite.draw(ctx)
	}
}
