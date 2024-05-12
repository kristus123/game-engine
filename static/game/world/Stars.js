export class Stars extends DynamicGameObject {
	constructor(x, y) {
		super(new Position(x, y, 16, 16), 1, 0)

		this.sprite = new Sprite(this, '/static/assets/stars.png', 16, 16, 6, [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
		], 300)
	}

	draw(draw, guiDraw) {
		this.sprite.draw(draw, guiDraw)
	}

}
