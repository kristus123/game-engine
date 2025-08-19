import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Grid } from '/static/engine/graphics/Grid.js'; 
import { GridPathFinder } from '/static/engine/mechanics/GridPathFinder.js'; 
import { LinePathFinder } from '/static/engine/mechanics/LinePathFinder.js'; 

export class PathFinder {
	constructor(source, target, gridSize = 50) {

				AssertNotNull(source, "argument source in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(target, "argument target in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(gridSize, "argument gridSize in " + this.constructor.name + ".js should not be null")
			
		this.source = source; 
		this.target = target; 
		this.gridSize = gridSize; 

		this.gridPathFinder = new GridPathFinder(gridSize)
		this.linePathFinder = new LinePathFinder()


		this.position = target
	}

	update() {
		this.gridPathFinder.update(this.source, this.target)
		this.linePathFinder.update(this.source, this.target)
		
		G.invisibleWalls.enforce(this.source)
		G.walkableAreas.enforce(this.source)

	}

	draw(draw, guiDraw) {
		if (this.linePathFinder.clearPath) {
			this.position = this.target
			this.linePathFinder.draw(draw, guiDraw)
		}
		else if (this.gridPathFinder.nextPosition) {
			this.position = this.gridPathFinder.nextPosition
			this.gridPathFinder.draw(draw, guiDraw)
		}
	}
}

