export class PathFinder {
	constructor(source, target, gridSize = 50) {
		this.gridPathFinder = new GridPathFinder(gridSize)
		this.linePathFinder = new LinePathFinder()


		this.position = target
	}

	update() {
		this.gridPathFinder.update(this.source, this.target)
		this.linePathFinder.update(this.source, this.target)

		G.invisibleWalls.enforce(this.source)
		G.walkableAreas.enforce(this.source)

	}

	draw() {
		if (this.linePathFinder.clearPath) {
			this.position = this.target
			this.linePathFinder.draw()
		}
		else if (this.gridPathFinder.nextPosition) {
			this.position = this.gridPathFinder.nextPosition
			this.gridPathFinder.draw()
		}
	}
}

