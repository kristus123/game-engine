export class Ra {
	constructor() {
	}

	static update(list) {
		list.forEach(e => {
			try {
				if (e.gameObject.update) {
					e.gameObject.update()
				}
			}
			catch (error) {
				throw new Error('an error occurred while running "update" method for '
					+ e.gameObject.constructor.name + '  ' + error)
			}
		})
	}

	static draw(list, draw, guiDraw) {
		if (draw == null || guiDraw == null) {
			throw new Error('null value passed to draw')
		}

		list.forEach(e => {
			try {
				if (e.gameObject.draw) {
					e.gameObject.draw(draw, guiDraw)
				}
			}
			catch (error) {
				throw new Error('an error occurred while running "draw" method for '
					+ e.gameObject.constructor.name + '  ' + error)
			}
		})
	}
}
