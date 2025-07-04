import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { ListLooper } from '/static/engine/code_tools/ListLooper.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Loop } from '/static/engine/core/Loop.js'; 

export class Steps {
	constructor(steps) {

				AssertNotNull(steps, "argument steps in " + this.constructor.name + ".js should not be null")
			
		this.steps = steps; 

		this.index = 0

		this.x = new ListLooper(steps, (s, next, completed, draw, guiDraw) => {

			if (s.completed()) {
				next()
			}
			else if (completed) {
				this.removeFromLoop()
			}
		})
	}

	draw(draw, guiDraw) {

	}

}
