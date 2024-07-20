export class PathDrawer {
	constructor(object, steps, invisibleWalls) {
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
