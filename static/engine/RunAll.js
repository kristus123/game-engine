export class RunAll {
	constructor(classes=[]) {

		for (const c of classes) {
			if (c == null) {
				throw new Error('null passed into Runall')
			}
		}
	}

	update() {
		this.classes.forEach(e => {
			try {
				if (e.update) {
					e.update()
				}
			}
			catch (error) {
				throw new Error('an error occurred while running "update" method for '
					+ e.constructor.name + '  ' + error)
			}
		})
	}

	draw(draw, guiDraw) {
		if (draw == null || guiDraw == null) {
			throw new Error('null value passed to draw')
		}

		this.classes.forEach(e => {
			try {
				if (e.draw) {
					e.draw(draw, guiDraw)
				}
			}
			catch (error) {
				throw new Error('an error occurred while running "draw" method for '
					+ e.constructor.name + '  ' + error)
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
