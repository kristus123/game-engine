export class StarBackground {
	constructor(camera) {
		this.stars = Random.positions(-1000, 2000, -1000, 2000, 500)
			.map(position => ({
				position: Random.direction(camera.position, 1000),
				color: Random.choice(['#638782', '#304e4f', '#1f2d2c', '#15282a', 'white']),
			}))


		this.stars2 = Random.positions(-100, 200, -100, 200, 50)
			.map(p => ({
				star: new Stars(p.x, p.y),
			}))
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.stars.forEach((star) => {
			const p = Parallax(star, this.camera, 0.99)
			draw.star(p, star.color)
		})

		this.stars2.forEach(star => {
			star.star.draw(draw, guiDraw)
		})
	}
}
