export class Noise {
	constructor(position, size=10) {
		this.simplexNoise = new SimplexNoise(0.001)

		this.time = 0

		this.positionAndNoiseValue = []

		this.positionAndNoiseValue = Positions.grid(position, size)
			.map(position => ({
				position: position,
				noise: this.simplexNoise.noise(position, this.time),
			}))
	}

	draw() {
		for (const { position, noise } of this.positionAndNoiseValue) {
			if (noise >= 0.5) {
				Draw.blueRectangle(position)
			}
			else {
				Draw.green(position)
			}
		}
	}
}
