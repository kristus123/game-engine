export class Chicken extends DynamicGameObject {
	constructor(p) { // todo find out what to do with this, or test if it even is a problem
		super(p, 10, 10)

		this.sprite = new Sprite(this, '/static/assets/Chicken_Sprite_Sheet.png', 32, 32, 5, [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		])
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.sprite.draw(draw, guiDraw)
	}
}
