export class StarBackground {
	constructor() {
		const numStars = 1000
		this.stars = []
		for (let i = 0; i < numStars; i++) {
			const x = Random.integerBetween(-10000, 10000)
			const y = Random.integerBetween(-10000, 10000)
			const width = Math.random() * 1 + 1 // Varying star widths
			const height = Math.random() * 1 + 1 // Varying star heights

			this.stars.push({ x, y, width, height })
		}
	}

	update() {

	}

	draw(draw) {
		draw.ctx.fillStyle = 'white'
		this.stars.forEach((s) => {
			draw.rectangle(s.x, s.y, s.width, s.height)
		})
	}
}