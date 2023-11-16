export class StarBackground {
	constructor() {
		this.palette = Palette.offscreen()

		const numStars = 1000
		this.stars = []
		for (let i = 0; i < numStars; i++) {
			const x = Random.numberBetween(-1000, 10000)
			const y = Random.numberBetween(-1000, 10000)
			const width = Math.random() * 1 + 1 // Varying star widths
			const height = Math.random() * 1 + 1 // Varying star heights

			this.stars.push({ x, y, width, height })
		}
	}

	draw(player) {
		Palette.fill(this.palette, 'black')
		this.palette.ctx.fillStyle = 'white'
		this.stars.forEach((s) => {
			Draw.rectangle(
				this.palette.ctx,
				s.x - player.x / 100,
				s.y - player.y / 100,
				s.width,
				s.height,
			)
		})

		return this.palette
	}
}
