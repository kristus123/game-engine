export class AllGameObjects {
	constructor() {

		this.allGameObjects = []

		this.origins = {}

		// todo reimplement
		// for (const c of classes) {
		// 	if (c == null) {
		// 		throw new Error('null passed into Runall')
		// 	}
		// }
	}

	add(origin, gameObject) {
		if (!this.origins[origin]) {
			this.origins[origin] = new RunAll(gameObjects)
		}

		this.origins[origin].add(gameObject)

		this.allGameObjects.push(gameObject)

		return gameObject
	}

	register(origin, gameObjects) {
		this.origins[origin] = new RunAll(gameObjects)

		this.allGameObjects.push(...gameObjects)

		return this.origins[origin]
	}

	remove(origin, o) {
		List.remove(this.allGameObjects, o)

		this.origins[origin].remove(o)
	}

	update() {
		this.allGameObjects.forEach(e => {
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

		this.allGameObjects.forEach(e => {
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
}
