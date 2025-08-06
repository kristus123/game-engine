import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Positions } from '/static/engine/core/position/Positions.js'; 
import { Noise } from '/static/engine/graphics/Noise.js'; 
import { SimplexNoise } from '/static/engine/graphics/SimplexNoise.js'; 

export class FollowPlayerNoise {
	constructor(player, viewable=4000, size=30) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(viewable, "argument viewable in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(size, "argument size in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 
		this.viewable = viewable; 
		this.size = size; 

		this.simplexNoise = new SimplexNoise(0.001)

		this.gridArea = player.position.offset(-viewable/2, (-viewable/2), viewable, viewable)

		this.t = 0

		this.blue = p => {}
	}

	draw(draw, guiDraw) {

		for (const position of Positions.grid(this.gridArea, this.size)) {
			// this.t += 0.0001
			const noiseValue = this.simplexNoise.noise(position, this.t)

			if (noiseValue >= 0.8) {
				draw.color(position, '#2AB1C6')
			}
			else {
				draw.color(position, '#4F9182')
			}
		}
	}
}
