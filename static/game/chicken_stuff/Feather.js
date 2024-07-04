export class Feather extends DynamicGameObject {

	constructor(position) {
		super(position, 10, 10)
		this.position = this.position.copy()


		const choice = Random.choice([
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
		])
		this.image = new SpriteFrame(this, '/static/assets/sprites/chicken_feathers_16x16.png', choice)
		this.position.width = 16
		this.position.height = 16

	}

	draw(draw, guiDraw) {
		this.image.draw(draw, guiDraw)
	}
}

