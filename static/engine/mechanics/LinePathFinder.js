export class LinePathFinder {
	constructor() {
		this.clearPath = false
	}

	update(source, target) {
		this.square ??= new Square(new Position(source.x, source.y), 10)


		EveryFrame(10, () => {
			console.log('hey')
			ForcePush(this.square).towards(target, 100)
		})


		if (this.square.touches(target)) {
			this.square = null
			this.clearPath = true
		}
		else if (G.invisibleWalls.collides(this.square)) {
			this.square = null
			this.clearPath = false
		}
		else if (G.walkableAreas.outside(this.square)) {
			this.square = null
			this.clearPath = false
		}
	}

	draw(draw, guiDraw) {
		if (this.square) {
			this.square.draw(draw, guiDraw)
		}
	}
}
