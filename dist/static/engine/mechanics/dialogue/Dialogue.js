import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { ListLooper } from '/static/engine/code_tools/ListLooper.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 

export class Dialogue {

	constructor(textTypers) {

				AssertNotNull(textTypers, "argument textTypers in " + this.constructor.name + ".js should not be null")
			
		this.textTypers = textTypers; 


		this.listLooper = new ListLooper(textTypers, (textTyper, next, completed, draw, guiDraw) => {
			textTyper.update()
			textTyper.draw(draw, guiDraw)

			if (textTyper.completed()) {
				next()
			}
		})
	}

	completed() {
		return this.listLooper.completed()
	}

	update() {
		this.listLooper.update()
	}

	draw(draw, guiDraw) {
		this.listLooper.draw(draw, guiDraw)
	}
}
