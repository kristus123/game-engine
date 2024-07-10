export class Noise {
	constructor(position, size=10) {
		this.simplexNoise = new SimplexNoise(0.001)

		this.time = 0

		this.positionAndNoiseValue = []
	}

	red(p) {
		for (const { position, noise } of this.positionAndNoiseValue) {
			if (Collision.between(p, position)) {
				if (noise >= 0.5) {
					return true
				}
			}
		}

		return false

	}

	draw(draw, guiDraw) {
		this.time += 2

		this.positionAndNoiseValue = Positions.grid(this.position, this.size)
			.map(position => ({
				position: position,
				noise: this.simplexNoise.noise(position, this.time),
			}))


		for (const { position, noise } of this.positionAndNoiseValue) {
			if (noise >= 0.5) {
				draw.transparentBlueRectangle(position)
			}
		}
	}
}
