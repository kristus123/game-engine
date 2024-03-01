export class Planets {
	constructor() {
		const imgs = [
			'/static/assets/planets/sun.png',
			'/static/assets/planets/dryhotplanet32x32.png',
			'/static/assets/planets/dryvenuslikeplane32x32t.png',
			'/static/assets/planets/exoplanet32x32.png',
			'/static/assets/planets/iceplanet32x32.png',
			'/static/assets/planets/moon27x26.png',
			'/static/assets/planets/neptunlikeplanet32x32.png',
			'/static/assets/planets/org_iceplanet.png',
			'/static/assets/planets/org_lava_planet.png',
			'/static/assets/planets/org_machine_world.png',
			'/static/assets/planets/org_shattered_planet.png',
			'/static/assets/planets/sphereplanet70x70.png',
		]

		this.planets = Random.positions(-10000, 10000, -10000, 10000, 100)
			.map(p => new Picture(new GameObject(p.x, p.y, 1000, 1000, 10, 10), Random.choice(imgs)))
	}

	draw(draw, guiDraw) {
		this.planets.forEach(p => p.draw(draw, guiDraw))
	}
}
