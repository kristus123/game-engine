export class StarBackground {
	constructor(camera) {
		this.stars = Random.positions(-1000, 2000, -1000, 2000, 500)
			.map(position => ({
				position: Random.direction(camera.position, 1000),
				color: Random.choice(['#638782', '#304e4f', '#1f2d2c', '#15282a', 'white']),
			}))
	}

	update() {
	}

	draw(draw) {
		this.stars.forEach((star) => {
			const parallaxFactor = 0.99
			const x = star.position.x + this.camera.position.x * parallaxFactor
			const y = star.position.y + this.camera.position.y * parallaxFactor

			draw.old_star(x, y, star.color)
		})
	}
}
