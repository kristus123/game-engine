export class StraightPath {

	constructor(startPosition) {
		this.target = Registry.player

		this.localObjects = new LocalObjects([
			Init(this, {
				line: new Square(startPosition.position.copy(), 20)
			})
		])

		this.blocked = true

		this.finishedChecking = false
	}

	update() {
		ForcePush(this.line).towards(this.target, 300)

		if (this.line.touchesAny(Registry.invisibleWalls)) {
			this.blocked = true

			this.line.x = this.startPosition.x
			this.line.y = this.startPosition.y
		}

		if (this.line.touches(this.target)) {
			this.blocked = false

			this.line.x = this.startPosition.x
			this.line.y = this.startPosition.y
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.line(this.line, this.target)
	}
}
