import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { EveryFrame } from '/static/engine/on/EveryFrame.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class LinePathFinder {
	constructor(source, target, walkableAreas) {

				AssertNotNull(source, "argument source in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(target, "argument target in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(walkableAreas, "argument walkableAreas in " + this.constructor.name + ".js should not be null")
			
		this.source = source; 
		this.target = target; 
		this.walkableAreas = walkableAreas; 

		this.clearPath = false
	}

	update() {
		this.square ??= new Square(new Position(this.source.x, this.source.y), 10)


		EveryFrame(10, () => {
			console.log('hey')
			this.square.forcePushTowards(this.target, 100)
		})


		if (this.square.touches(this.target)) {
			this.square = null
			this.clearPath = true
		}
		else if (G.invisibleWalls.collides(this.square)) {
			this.square = null
			this.clearPath = false
		}
		else if (this.walkableAreas.outside(this.square)) {
			this.square = null
			this.clearPath = false
		}
	}

	draw(draw) {
		if (this.square) {
			this.square.draw(draw)
		}
	}
}
