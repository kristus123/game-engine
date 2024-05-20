export class Planet extends DynamicGameObject {
	constructor(x, y) {
		super(new Position(x, y, 1500, 1500), 2300, 8)

		this.localObjects = new LocalObjects([
			new Picture(this, '/static/assets/planets/exoplanet32x32.png'),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.gradient(new Position(this.x + 750, this.y + 750))
	}

}
