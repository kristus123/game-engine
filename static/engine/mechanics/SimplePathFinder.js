export class SimplePathFinder {
	constructor(target, invisibleWalls) {
		this.object = new Square(new Position(400, 10), 100)

		this.c1 = new Square(new Position(400, 10), 20)

		this.localObjects = new LocalObjects([
			this.object,
			this.c1,
		])

		this.rotationAmount = 0

		this.speed = 5

		Move(this.c1).towards(this.target, this.speed)

		this.angle1 = this.c1.position.copy()
	}

	update() {
		this.localObjects.update()

		for (const wall of this.invisibleWalls) {
			if (Collision.between(this.c1, wall)) {
				this.c1.position = this.object.position.copy()
				this.c1.velocity.reset()
				console.log("collision. resetting")
				this.rotationAmount += 10

				Move(this.c1).towards(this.target, this.speed)
				this.c1.velocity.rotate(this.rotationAmount)

				this.angle1 = this.c1.position.copy()
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.line(this.c1, this.target)
	}
}
