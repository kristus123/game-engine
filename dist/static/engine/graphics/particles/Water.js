import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

export class Water {
	constructor() {



		this.droplets = Random.positions(-300, 300, -300, 300, 100).map(p => {
			const waterDroplet = new DynamicGameObject(new Position (x, y, width, height), 10, 1000)

			waterDroplet.originalPosition = {
				x: waterDroplet.x,
				y: waterDroplet.y,
			}

			return waterDroplet
		})
	}

	draw(draw, guiDraw) {
		this.droplets.forEach(d => {
			draw.blue(d)
		})
	}
}
