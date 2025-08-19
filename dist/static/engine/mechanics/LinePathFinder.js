import { G } from '/static/engine/G.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class LinePathFinder {
	constructor() {


		this.clearPath = false
	}

	update(source, target) {
		this.square ??= new Square(new Position(source.x, source.y), 10)

		ForcePush(this.square).towards(target, 100)

		for (const w of G.invisibleWalls.positions) {
			if (this.square.touches(w)) {
				this.square = new Square(new Position(source.x, source.y), 10)
				this.clearPath = false
			}
		}

		if (this.square.touches(target)) {
			this.square = new Square(new Position(source.x, source.y), 10)
			this.clearPath = true
		}
	}

	draw(draw, guiDraw) {
	}
}
