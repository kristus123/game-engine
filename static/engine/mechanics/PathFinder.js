export class PathFinder {
	constructor(source, target, gridSize = 50) {
		this.gridPathFinder = new GridPathFinder(gridSize)
		this.linePathFinder = new LinePathFinder()
	}

	update() {
		this.gridPathFinder.update(this.source, this.target)
		this.linePathFinder.update(this.source, this.target)
		
		G.invisibleWalls.enforce(this.source)
		G.walkableAreas.enforce(this.source)

	}

	draw(draw, guiDraw) {
		if (this.linePathFinder.clearPath) {
			this.linePathFinder.draw(draw, guiDraw)
			ForcePush(this.source).towards(this.target)
		}
		else if (this.gridPathFinder.nextPosition) {
			ForcePush(this.source).towards(this.gridPathFinder.nextPosition)
			this.gridPathFinder.draw(draw, guiDraw)
		}
		else {
			console.log("???")
		}
	}
}

