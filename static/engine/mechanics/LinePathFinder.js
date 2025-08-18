export class LinePathFinder {
	constructor(source, target) {
		this.square = new Square(new Position(source.x, source.y), 10)

		this.localObjects = new LocalObjects([
		])


		this.clearPath = false
	}

	update() {
		ForcePush(this.square).towards(this.target, 100)

		for (const w of G.invisibleWalls) {
			if (this.square.touches(w)) {
				this.square = new Square(new Position(this.source.x, this.source.y), 10)
				this.clearPath = false
			}
		}

		if (this.square.touches(this.target)) {
			this.square = new Square(new Position(this.source.x, this.source.y), 10)
			this.clearPath = true
		}
	}

	draw(draw, guiDraw) {
		draw.line(this.source, this.target)
		this.square.draw(draw, guiDraw)
	}
}
