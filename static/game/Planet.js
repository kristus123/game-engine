export class Planet extends GameObject {
	constructor(x, y) {
		super(x, y, 1500, 1500, 2300, 8)

		this.runAll = new RunAll([
			new Picture(this, '/static/assets/planets/exoplanet32x32.png'),
			{
				draw: draw => draw.gradient(new Position(1250, 750)),
			},
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}


}
