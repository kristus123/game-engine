export class Blur {
	constructor() {
		this.canvas = Camera.palette.canvas
		this.ctx = Camera.palette.ctx

		this.positions = Positions.grid(new Position(0, 0, 3000, 1000), 60).map(p => ({
			position: p,
			color: Random.choice(['white', 'grey']),
		}))
	}

	draw(draw, guiDraw) {
		for (const { position, color } of this.positions) {
			draw.rectangle(position, color)
		}

	}
}
