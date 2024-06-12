export class StarBackground {
	constructor(camera) {
		this.stars = Random.positions(-10, 20, -10, 20, 500)
			.map(position => ({
				position: Random.direction(camera.position, 1000),
				color: Random.choice(['#638782', '#304e4f', '#1f2d2c', '#15282a', 'white']),
			}))
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.stars.forEach((star) => {
			const p = Parallax(star, this.camera, 0.99)
			draw.star(p, star.color)
		})
	}
}
