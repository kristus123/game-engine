const planet = new Picture(new GameObject(-1800, 0, 100, 100, 10, 10), 'https://www.nicepng.com/png/full/6-69021_mars-planet-png-mercury-planet-cartoon-png.png')
export class Planets {

	constructor() {
		const numPlanets = 10000
		const imgs = [
			'/static/assets/planets/sun.png',
			'/static/assets/planets/ryhotplanet32x32.png',
			'/static/assets/planets/dryvenuslikeplane32x32t.png',
			'/static/assets/planets/exoplanet32x32.png',
			'/static/assets/planets/iceplanet32x32.png',
			'/static/assets/planets/moon27x26.png',
			'/static/assets/planets/neptunlikeplanet32x32.png',
			'/static/assets/planets/org_iceplanet.png',
			'/static/assets/planets/org_lava_planet.png',
			'/static/assets/planets/org_machine_world.png',
			'/static/assets/planets/org_shattered_planet.png',
			'/static/assets/planets/sphereplanet70x70.png'
		]

		this.planets = []
		for (let i = 0; i < numPlanets; i++) {
			const x = Random.integerBetween(-10000, 10000)
			const y = Random.integerBetween(-10000, 10000)
			const imgNum = Math.ceil(Math.random() * imgs.length) - 1
			const img = imgs[imgNum]

			this.planets.push({ img, x, y })
		}
	}

	draw(ctx) {
		planet.gameObject.width = 50
		planet.gameObject.height = 50
		for (const pl of this.planets) {
			planet.image.src = pl.img
			planet.gameObject.x = pl.x
			planet.gameObject.y = pl.y
			planet.draw(ctx)
		}
	}
}
