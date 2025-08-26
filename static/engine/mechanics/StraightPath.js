export class StraightPath {
	constructor(start, end) {

		this.localObjects = new LocalObjects([
			Init(this, {
				line: new Square(start.position.copy(), 20)
			})
		])

		this.blocked = true

		this.finishedChecking = false
	}

	get clear() {
		return !this.blocked
	}

	update() {
		ForcePush(this.line).towards(this.end, 300)

		if (this.line.touchesAny(Registry.invisibleWalls)) {
			this.blocked = true

			this.line.x = this.start.x
			this.line.y = this.start.y
		}

		if (this.line.touches(this.end)) {
			this.blocked = false

			this.line.x = this.start.x
			this.line.y = this.start.y
		}

		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
		draw.line(this.line, this.end)
	}
}
