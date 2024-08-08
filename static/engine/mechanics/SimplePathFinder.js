export class SimplePathFinder {
	constructor(target, invisibleWalls) {
		this.startPosition = new Square(new Position(400, 10), 100)

		this.c1 = new Square(new Position(400, 10), 20)
		this.c2 = new Square(new Position(400, 10), 20)
		this.c2.draw = (draw, guiDraw) => {
			draw.rectangle(this.c2.position, 'orange')
		}

		this.localObjects = new LocalObjects([
			this.startPosition,
			this.c1,
			this.c2,
		])

		this.rotationAmount = 0

		this.speed = 15

		this.angle1 = this.c1.position.copy()

		this.c1Active = true

		this.success = false
		this.touchedC1 = false
	}

	update() {

		this.localObjects.update()


		let closestWall = this.invisibleWalls[0]
		if (this.c1Active) {
			Move(this.c1).to(this.target, this.rotationAmount, this.speed)

			for (const wall of this.invisibleWalls) {
				if (Distance.between(this.c1, wall) < Distance.between(this.c1, closestWall)) {
					closestWall = wall
				}

				if (this.c1.touches(wall)) {
					this.c1.position = this.startPosition.position.copy()
					this.rotationAmount += 100
				}
			}

			if (Distance.between(this.c1, closestWall) > 300) {
				Move(this.c1).to(this.target, 0, this.speed)
			}

			this.c1Active = false
		}
		else {
			Move(this.c2).to(this.target, 0, this.speed)
			let c2Collision = false
			for (const wall of this.invisibleWalls) {
				if (this.c2.touches(wall)) {
					c2Collision = true
					break
				}
			}

			if (c2Collision) {
				this.c2.position = this.c1.position.copy()
				this.c1Active = true
			}

			if (this.c2.within(100, this.target)) {
				console.log('sucesss')
				this.success = true
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.line(this.c1, this.target)
	}
}
