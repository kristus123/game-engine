export class Chicken extends DynamicGameObject {
	constructor(player) {
		super(new Position(-1800, -200, 150, 150), 10, 10)

		this.sprite = new Sprite(this, '/static/assets/Chicken_Sprite_Sheet.png', 32, 32, 5, [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		])
	}

	onCollision(o) {
		this.runAll.remove(this)

		const splash = new Splash()
		splash.splashOpposite(this.position.center, this.player.position.center, 0.7, 'red')
		this.runAll.add(splash)
		setTimeout(() => {
			this.runAll.remove(splash)
		}, 10_000)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.sprite.draw(draw, guiDraw)
	}
}
