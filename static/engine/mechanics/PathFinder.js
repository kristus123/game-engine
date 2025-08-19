export class PathFinder {
	constructor(source, target, gridSize = 50) {
		this.gridPathFinder = new GridPathFinder(gridSize)
		this.linePathFinder = new LinePathFinder()
	}

	update() {
		this.gridPathFinder.update(this.source, this.target)
		this.linePathFinder.update(this.source, this.target)

		
		for (const w of G.invisibleWalls) {
			w.enforce(this.source)
		}
		G.walkableAreas.enforce(this.source)

		if (this.linePathFinder.clearPath) {
			console.log("hey")
			ForcePush(this.source).towards(this.target)
		}
		else if (this.gridPathFinder.nextPosition) {
			ForcePush(this.source).towards(this.gridPathFinder.nextPosition)
		}
	}

	draw(draw, guiDraw) {
		this.gridPathFinder.draw(draw, guiDraw)
		this.linePathFinder.draw(draw, guiDraw)
	}
}

