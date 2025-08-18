export class PathFinder {
	constructor(source, target, gridSize = 50) {

		this.localObjects = new LocalObjects([
			this.gridPathFinder = new GridPathFinder(source, target, gridSize),
			this.linePathFinder = new LinePathFinder(source, target),
			this.path = new Path(source, this.gridPathFinder.path),
		])
	}


	update() {
		if (this.linePathFinder.clearPath) {
			ForcePush(this.source).towards(this.target)
		}
		else {
			this.path.update()
			this.source.velocity.reset()
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}

