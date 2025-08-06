import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Positions } from '/static/engine/core/position/Positions.js'; 
import { SimplexNoise } from '/static/engine/graphics/SimplexNoise.js'; 

export class Noise {
	constructor(position, size=10) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(size, "argument size in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.size = size; 

		this.simplexNoise = new SimplexNoise(0.001)

		this.time = 0

		this.positionAndNoiseValue = []

		this.positionAndNoiseValue = Positions.grid(position, size)
			.map(position => ({
				position: position,
				noise: this.simplexNoise.noise(position, this.time),
			}))
	}

	draw(draw, guiDraw) {
		for (const { position, noise } of this.positionAndNoiseValue) {
			if (noise >= 0.5) {
				draw.blueRectangle(position)
			}
			else {
				draw.green(position)
			}
		}
	}
}
