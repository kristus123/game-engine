export class Water {
	constructor(player) {

		this.physics = new Physics()

		this.physics.applyPhysics(player)

		const numStars = 1000

		this.stars = []
		for (let i = 0; i < numStars; i++) {
			const x = Random.numberBetween(-300, 300)
			const y = Random.numberBetween(-300, 300)
			const width = Math.random() * 1 + 1 // Varying star widths
			const height = Math.random() * 1 + 1 // Varying star heights

			const velocityFactor = 1000
			const weight = 1

			const waterDroplet = new GameObject(x, y ,width, height, weight, velocityFactor)

			this.stars.push(waterDroplet)
			this.physics.applyPhysics(waterDroplet)
		}
	}

	draw(ctx) {
		this.stars.forEach((s) => {
			Draw.blueRectangle(ctx, s.x, s.y, s.width, s.height)
		})
	}
}
