export class LinePathFinder {
	constructor(source, target, walkableAreas) {
		this.clearPath = false
	}

	update() {
		this.square ??= Square(WorldPosition(this.source.x, this.source.y), 10)

		EveryFrame(10, () => {
			console.log('hey')
			this.square.forcePushTowards(this.target, 100)
		})


		if (this.square.touches(this.target)) {
			this.square = null
			this.clearPath = true
		}
		else if (G.invisibleWalls.collides(this.square)) {
			this.square = null
			this.clearPath = false
		}
		else if (this.walkableAreas.outside(this.square)) {
			this.square = null
			this.clearPath = false
		}
	}

}
