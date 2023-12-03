export class Water {
	constructor() {
		this.droplets = []
		for (let i = 0; i < 100; i++) {
			const x = Random.integerBetween(-300, 300)
			const y = Random.integerBetween(-300, 300)
			const width = Math.random() * 1 + 1 // Varying star widths
			const height = Math.random() * 1 + 1 // Varying star heights

			const velocityFactor = 1000
			const weight = 10

			const waterDroplet = new GameObject(x, y ,width, height, weight, velocityFactor)
			waterDroplet.originalPosition = {
				x: waterDroplet.x,
				y: waterDroplet.y,
			}

			this.droplets.push(waterDroplet)
		}
	}

	draw(ctx) {
		this.droplets.forEach((s) => {
			Draw.blueRectangle(ctx, s.x, s.y, s.width, s.height)
		})
	}
}
