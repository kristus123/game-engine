export class StraightPath {
	constructor(startPosition, target) {

		this.line = new Square(startPosition.position.copy(), 20)

		this.localObjects = new LocalObjects([
			this.line,
		])

		this.blocked = true

		this.finishedChecking = false
	}

	update() {

		ForcePush(this.line).towards(this.target, 5)

		if (InvisibleWalls.touchedBy(this.line)) {
			this.blocked = true
			this.line.x = this.startPosition.x
			this.line.y = this.startPosition.y
		}
		else if (this.line.touches(this.target)) {
			this.blocked = false
		}
		

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.line(this.line, this.target)
	}
}
