export class StarBackground {
	constructor(player) {
		this.stars = Random.positions(-1000, 20000, -1000, 20000, 500)
			.map(position => ({
				position: Random.direction(player.position, 1000),
				color: Random.choice(['#638782', '#304e4f', '#1f2d2c', '#15282a', 'white']),
			}))
	}

	update() {
	}

	draw(draw) {
		this.stars.forEach((star) => {
			const parallaxFactor = 1
			const x = star.position.x + this.player.position.x * parallaxFactor;
			const y = star.position.y + this.player.position.y * parallaxFactor;

			draw.star(new Position(x, y), star.color);
		})
	}
}
