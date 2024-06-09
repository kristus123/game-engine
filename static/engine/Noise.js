export class Noise {
    constructor(position, size=10, seed=Math.random()) {
        const simplexNoise = new SimplexNoise(0.1);

		this.positionAndNoiseValue = Positions.grid(position, size)
			.map(position => ({
				position: position,
				noiseValue: simplexNoise.noise(position),
				//noiseValue: Random.integerBetween(-1, 1)
			}))
    }

    draw(draw, guiDraw) {
		for (const {position, noiseValue} of this.positionAndNoiseValue) {
		
			if (noiseValue >= 0.0) {
				draw.blue(position)
			}
			else {
				draw.green(position)
			}
		}
    }
}
