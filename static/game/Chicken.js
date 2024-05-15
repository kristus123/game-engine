export class Chicken extends DynamicGameObject {
	constructor() {
		super(new Position(0, 0, 150, 150), 10, 10)

		this.sprite = new Sprite(this, '/static/assets/Chicken_Sprite_Sheet.png', 32, 32, 5, [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		])
	}

	onHit() {
		console.log("chicken hit!")
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.sprite.draw(draw, guiDraw)
	}
}
