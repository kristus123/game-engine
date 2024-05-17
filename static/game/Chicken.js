export class Chicken extends DynamicGameObject {
	constructor(p) { // todo find out what to do with this, or test if it even is a problem
		super(p, 10, 10)

		this.position.width = 60
		this.position.height = 60

		this.sprite = new Sprite(this, '/static/assets/Chicken_Sprite_Sheet.png', 32, 32, 2, [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		])
	}

	onHit() {
		console.log(this + ' got hit')
		this.removeFromGameLoop()
	}

	update() {
		const p = Random.direction(this, 0.1)

		this.x = p.x
		this.y = p.y
	}

	draw(draw, guiDraw) {
		draw.new_text(this.position.offset(0, -20), 'Horny chicken', 'red', 38)
		// super.draw(draw, guiDraw)
		this.sprite.draw(draw, guiDraw)
	}
}
