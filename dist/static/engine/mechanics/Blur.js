import { a } from '/static/engine/code_tools/a.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Positions } from '/static/engine/position/Positions.js'; 

export class Blur {
	constructor() {


		this.canvas = Camera.palette.canvas
		this.ctx = Camera.palette.ctx

		this.positions = Positions.grid(new Position(0, 0, 3000, 1000), 60).map(p => ({
			position: p,
			color: Random.choice(['white', 'grey']),
		}))
	}

	draw(draw, guiDraw) {
		for (const { position, color } of this.positions) {
			draw.rectangle(position, color)
		}

	}
}
