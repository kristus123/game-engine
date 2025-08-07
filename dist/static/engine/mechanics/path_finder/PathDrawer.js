import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { PathFinder } from '/static/engine/mechanics/path_finder/PathFinder.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export class PathDrawer {
	constructor(object, steps, invisibleWalls) {

				AssertNotNull(object, "argument object in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(steps, "argument steps in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(invisibleWalls, "argument invisibleWalls in " + this.constructor.name + ".js should not be null")
			
		this.object = object; 
		this.steps = steps; 
		this.invisibleWalls = invisibleWalls; 

		this.localObjects = new LocalObjects([
			new Quest(steps.map(position => () => new class {
				constructor() {
					this.pathFinder = new PathFinder(object, position, invisibleWalls)

					this.localObjects = new LocalObjects([
						this.pathFinder
					])
				}

				update() {
					this.localObjects.update()
				}

				draw(draw, guiDraw) {
					this.localObjects.draw(draw, guiDraw)
				}

				completed() {
					return this.pathFinder.completed
				}
			}))
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
