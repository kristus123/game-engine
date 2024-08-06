export class SimplePathFinder {
	constructor(target, invisibleWalls) {
		this.object = new Square(new Position(400, 10), 100)

		this.c1 = new Square(new Position(400, 10), 20)

		this.localObjects = new LocalObjects([
			this.object,
			this.c1
		])

	}

	update() {
		this.localObjects.update()

		for (const wall of this.invisibleWalls) {
			if (Collision.between(this.c1, wall)) {
				this.c1.position = this.object.position.copy()
				this.c1.velocity.reset()
				console.log("collision. resetting")
			}
			else {
				Push(this.c1).towards(this.target, 1)
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
