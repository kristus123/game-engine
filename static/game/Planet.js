export class Planet extends GameObject {
	constructor(x, y) {
		super(x, y, 40, 50, 2300, 8)

		this.picture = new Picture(this, '/static/assets/planets/exoplanet32x32.png')
	}
}
