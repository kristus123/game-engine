export class Noise {
	constructor(position, size=5) {
		const simplexNoise = new SimplexNoise(0.01)
		this.simplexNoise = simplexNoise

		this.positionAndNoiseValue = Positions.grid(position, size)
			.map(position => ({
				position: position,
				noiseValue: simplexNoise.noise(position),
			}))

		this.t = 0
	}


	draw(draw, guiDraw) {
		for (const { position, } of this.positionAndNoiseValue) {
			this.t += 0.0001
			const noiseValue = this.simplexNoise.noise(position, this.t)

			if (noiseValue >= -0.5) {
				draw.blue(position)
			}
			else {
				draw.green(position)
			}
		}
	}
}
