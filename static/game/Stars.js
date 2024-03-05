export class Stars extends GameObject {
	constructor(x, y) {
		super(x, y, 16, 16, 1, 0)

		this.picture = new Sprite(this, "/static/assets/stars.png", 16, 16, 6, [
			{x: 0, y: 0},
			{x: 1, y: 0},
			{x: 2, y: 0},
			{x: 3, y: 0},
		], 100)
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)
	}

}
