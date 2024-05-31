export class Planet extends DynamicGameObject {
	constructor(position) {
		super(position, 2300, 8)

		this.position.width = 1500
		this.position.height = 1500

		this.picture = new Picture(this.position, '/static/assets/planets/exoplanet32x32.png')
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)

		draw.gradient(this.position.offset(750, 750))
	}

}
