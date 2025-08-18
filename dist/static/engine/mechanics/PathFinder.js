import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Grid } from '/static/engine/graphics/Grid.js'; 
import { GridPathFinder } from '/static/engine/mechanics/GridPathFinder.js'; 
import { LinePathFinder } from '/static/engine/mechanics/LinePathFinder.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
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


		this.localObjects = new LocalObjects([
			this.gridPathFinder = new GridPathFinder(source, target, gridSize),
			this.linePathFinder = new LinePathFinder(source, target),
			this.path = new Path(source, this.gridPathFinder.path),
		])
	}


	update() {
		if (this.linePathFinder.clearPath) {
			ForcePush(this.source).towards(this.target)
		}
		else {
			this.path.update()
			this.source.velocity.reset()
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}

