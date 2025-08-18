import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class LinePathFinder {
	constructor(source, target) {

				AssertNotNull(source, "argument source in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(target, "argument target in " + this.constructor.name + ".js should not be null")
			
		this.source = source; 
		this.target = target; 

		this.square = new Square(new Position(source.x, source.y), 10)

		this.localObjects = new LocalObjects([
		])


		this.clearPath = false
	}

	update() {
		ForcePush(this.square).towards(this.target, 100)

		for (const w of G.invisibleWalls) {
			if (this.square.touches(w)) {
				this.square = new Square(new Position(this.source.x, this.source.y), 10)
				this.clearPath = false
			}
		}

		if (this.square.touches(this.target)) {
			this.square = new Square(new Position(this.source.x, this.source.y), 10)
			this.clearPath = true
		}
	}

	draw(draw, guiDraw) {
		draw.line(this.source, this.target)
		this.square.draw(draw, guiDraw)
	}
}
