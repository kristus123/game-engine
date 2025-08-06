import { Random } from '/static/engine/Random.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

export class Rain {
	constructor(position) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

		this.localObjects = new LocalObjects()

		setInterval(() => {
			const rainDrop = new Square(Random.positionWithin(position), 1)

			rainDrop.update = () => {
				Push(rainDrop).towards(rainDrop.position.offset(0, 100), 0.1)
				setTimeout(() => {
					this.localObjects.remove(rainDrop)
				}, 8_000)
			}
			this.localObjects.add(rainDrop)
		}, 100)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
