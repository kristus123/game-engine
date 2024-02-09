export class StarBackground {
	constructor() {
		this.stars = Random.positions(-1000, 20000, -1000, 20000, 5000)
			.map(position => ({
				position: position,
				color: Random.choice(['#638782', '#304e4f', '#1f2d2c', '#15282a', 'white']),
			}))
	}

	update() {
	}

	draw(draw) {
		this.stars.forEach((x) => {
			draw.star(x.position, x.color)
		})
	}
}
