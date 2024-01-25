export class StarBackground {
	constructor() {
		this.stars = Random.positions(-1000, 20000, -1000, 20000, 10000)
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
