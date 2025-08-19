import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Grid } from '/static/engine/graphics/Grid.js'; 
import { GridPathFinder } from '/static/engine/mechanics/GridPathFinder.js'; 
import { LinePathFinder } from '/static/engine/mechanics/LinePathFinder.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

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
	}

	update() {
		this.gridPathFinder.update(this.source, this.target)
		this.linePathFinder.update(this.source, this.target)

		
		for (const w of G.invisibleWalls) {
			w.enforce(this.source)
		}
		G.walkableAreas.enforce(this.source)

		if (this.linePathFinder.clearPath) {
			console.log("hey")
			ForcePush(this.source).towards(this.target)
		}
		else if (this.gridPathFinder.nextPosition) {
			ForcePush(this.source).towards(this.gridPathFinder.nextPosition)
		}
	}

	draw(draw, guiDraw) {
		this.gridPathFinder.draw(draw, guiDraw)
		this.linePathFinder.draw(draw, guiDraw)
	}
}

