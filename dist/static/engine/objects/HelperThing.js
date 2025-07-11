import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 

export class HelperThing {
	constructor(classes=[]) {

				AssertNotNull(classes, "argument classes in " + this.constructor.name + ".js should not be null")
			
		this.classes = classes; 


		for (const c of classes) {
			if (c == null) {
				throw new Error('null passed into Runall')
			}
		}
	}

	static update(objects) {
		this.updateAnd(objects, () => {})
	}

	static updateAnd(objects, run=() => {}) {
		for (const o of objects) {
			try {
				if (o.update) {
					run(o)
					o.update()
				}
			}
			catch (error) {
				throw error
			}
		}
	}

	static draw(objects, draw, guiDraw) {
		if (draw == null || guiDraw == null) {
			throw new Error('null value passed to draw')
		}

		objects.forEach(e => {
			try {
				if (e.draw) {
					e.draw(draw, guiDraw)
				}
			}
			catch (error) {
				throw error
				//throw new Error('an error occurred while running "draw" method for '
				//+ e.constructor.name + '  ' + error)
			}
		})
	}

	add(c) {
		this.classes.push(c)
		return c
	}

	remove(c) {
		List.remove(this.classes, c)
	}
}
