import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Noise } from '/static/engine/graphics/Noise.js'; 
import { SimplexNoise } from '/static/engine/graphics/SimplexNoise.js'; 
import { Positions } from '/static/engine/position/Positions.js'; 

export class HeightMap {
	constructor(position, scale) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(scale, "argument scale in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.scale = scale; 

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

