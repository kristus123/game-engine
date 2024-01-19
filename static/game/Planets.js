const planet = new Picture(new GameObject(-1800, 0, 100, 100, 10, 10), 'https://www.nicepng.com/png/full/6-69021_mars-planet-png-mercury-planet-cartoon-png.png')

const numPlanets = 10000
const imgPath = '/static/assets/planets/'
const imgs = ['sun.png', 'dryhotplanet32x32.png', 'dryvenuslikeplane32x32t.png', 'exoplanet32x32.png', 'iceplanet32x32.png', 'moon27x26.png', 'neptunlikeplanet32x32.png', 'org_iceplanet.png', 'org_lava_planet.png', 'org_machine_world.png', 'org_shattered_planet.png', 'sphereplanet70x70.png']

export class Planets {

	constructor() {
		this.planets = []
		for (let i = 0; i < numPlanets; i++) {
			const x = Random.integerBetween(-10000, 10000)
			const y = Random.integerBetween(-10000, 10000)
			const width = Math.random() * 1 + 1 // Varying star widths
			const height = Math.random() * 1 + 1 // Varying star heights
			const imgNum = Math.ceil(Math.random() * imgs.length) - 1
			const img = imgPath + imgs[imgNum]

			this.planets.push({ img, x, y, width, height })
		}
	}

	draw(ctx) {
		// planet.gameObject.width = s.width
		// planet.gameObject.height = s.height
		// planet.gameObject.x = s.s.x
		// planet.gameObject.y = s.s.y

		planet.gameObject.width = 100
		planet.gameObject.height = 100
		for(let i=0; i<this.planets.length; i++) {
			planet.img = this.planets[i].img
			planet.gameObject.x = this.planets[i].x
			planet.gameObject.y = this.planets[i].y
			planet.draw(ctx)
		}
	}

	drawImage(ctx, image, position) {
		const aspectRatio = image.width / image.height

		const maxWidth = 800
		const maxHeight = 800

		let newWidth = maxWidth
		let newHeight = maxHeight

		if (image.width > maxWidth) {
			newWidth = maxWidth
			newHeight = newWidth / aspectRatio
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight
			newWidth = newHeight * aspectRatio
		}

		ctx.save()
		ctx.translate(position.x, position.y)
		ctx.drawImage(image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)
		ctx.restore()
	}

}
