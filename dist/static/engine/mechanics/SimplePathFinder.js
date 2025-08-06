import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Distance } from '/static/engine/code_tools/misc/Distance.js'; 
import { Move } from '/static/engine/core/physics/Move.js'; 
import { Position } from '/static/engine/core/position/Position.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export class SimplePathFinder {
	constructor(startPosition, target, invisibleWalls) {

				AssertNotNull(startPosition, "argument startPosition in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(target, "argument target in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(invisibleWalls, "argument invisibleWalls in " + this.constructor.name + ".js should not be null")
			
		this.startPosition = startPosition; 
		this.target = target; 
		this.invisibleWalls = invisibleWalls; 


		this.c1 = new Square(startPosition.position.copy(), 20)

		this.c2 = new Square(startPosition.position.copy(), 20)
		this.c2.draw = (draw, guiDraw) => {
			draw.rectangle(this.c2.position, 'orange')
		}

		this.localObjects = new LocalObjects([
			this.c1,
			this.c2,
		])

		this.rotationAmount = 0

		this.speed = 10

		this.angle1 = this.c1.position.copy()

		this.c1Active = true

		this.success = false
		this.touchedC1 = false
	}

	update() {

		this.localObjects.update()

		let closestWall = new Position(9000, 9000, 100, 100)
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
				this.success = true
			}
		}
	}

	draw(draw, guiDraw) {
		// this.localObjects.draw(draw, guiDraw)

		// draw.line(this.c1, this.target)
	}
}
