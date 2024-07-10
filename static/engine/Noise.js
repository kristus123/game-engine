export class Noise {
	constructor(position, size=10) {
		const simplexNoise = new SimplexNoise(0.001)
		this.simplexNoise = simplexNoise

		this.positionAndNoiseValue = Positions.grid(position, size)
			.map(position => ({
				position: position,
				noise: simplexNoise.noise(position),
			}))
	}

	draw(draw, guiDraw) {
		for (const { position, noise } of this.positionAndNoiseValue) {
			if (Distance.between(this.player, position) < 500) {
				if (noise >= 0) {
					draw.blue(position)
				}
			}
		}
	}
}
