export class Chicken extends GameObject {
	constructor(player) {
		super(-1800, -200, 150, 150, 10, 10)
		this.player = player

		this.sprite = new Sprite(this, '/static/assets/Chicken_Sprite_Sheet.png')

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
