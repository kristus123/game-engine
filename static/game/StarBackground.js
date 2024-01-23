export class StarBackground {
	constructor() {
		this.stars = Random.positions(new Position(-10000, -10000), new Position(10000, 10000), 1000)
	}

	update() {
	}

	draw(draw) {
		draw.ctx.fillStyle = 'white'
		this.stars.forEach((s) => {
			draw.star(s)
		})
	}
}
