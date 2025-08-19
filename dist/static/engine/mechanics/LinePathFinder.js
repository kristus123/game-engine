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


		if (this.square.touches(target)) {
			this.square = null
			this.clearPath = true
		}
		else if (G.invisibleWalls.collides(this.square)) {
			this.square = null
			this.clearPath = false
		}
		else if (G.walkableAreas.outside(this.square)) {
			this.square = null
			this.clearPath = false
		}
	}

	draw(draw, guiDraw) {
		if (this.square) {
			this.square.draw(draw, guiDraw)
		}
	}
}
