export class HelperThing {
	constructor(classes=[]) {

		for (const c of classes) {
			if (c == null) {
				throw new Error('null passed into Runall')
			}
		}
	}

	static update(objects) {
		HelperThing.updateAnd(objects, () => {})
	}

	static updateAnd(objects, run=() => {}) {
		objects.forEach(o => {
			try {
				if (o.update) {
					run(o)
					o.update()
				}
			}
			catch (error) {
				throw error
				// throw new Error('an error occurred while running "update" method for '
				// + o.constructor.name + '  ' + error)
			}
		})
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
