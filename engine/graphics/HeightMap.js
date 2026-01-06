export class HeightMap {
	constructor(position, scale) {
		this.scale = scale
		this.simplex = new SimplexNoise(0.001)

		this.positions = Positions.grid(this.position, this.scale).map(position => ({
			position: position,
			value: Math.floor((this.simplex.noise(position)+ 1) * 128),
		}))
	}

	draw(draw) {
		for (const { position, value } of this.positions) {
			draw.color(position, `rgb(${value}, ${value}, ${value})`)
		}
	}
}

