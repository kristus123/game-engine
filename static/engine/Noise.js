export class Noise {
	constructor(position, size=10) {
		const simplexNoise = new SimplexNoise(0.001)
		this.simplexNoise = simplexNoise

		this.positionAndNoiseValue = Positions.grid(position, size)
			.map(position => ({
				position: position,
				noiseValue: simplexNoise.noise(position),
			}))

		this.t = 0
	}

	draw(draw, guiDraw) {
		for (const { position } of this.positionAndNoiseValue) {
			this.t += 0.0001
			const noiseValue = this.simplexNoise.noise(position, this.t)

			if (noiseValue >= 0) {
				draw.blue(position)
			}
			else {
				draw.green(position)
			}
		}
	}
}
