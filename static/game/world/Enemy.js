export class Enemy extends DynamicGameObject {
	constructor(position, player, onDamage= () => {}) {
		super(position, 1000, 10)

		this.position.width = 100
		this.position.height = 100

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/bad_ninja.png')
		])
	}

	update() {
		Push(this).towards(this.player, 0.2)
		if (this.touches(this.player)) {
			this.onDamage()
		}
		this.localObjects.update()
	}

	draw(draw, guiDraw) {

		this.localObjects.draw(draw, guiDraw)
	}

}
