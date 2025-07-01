import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Move } from '/static/engine/core/physics/Move.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 

export class Ranch extends StaticGameObject {
	constructor(position) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 500
		this.position.height = 200

		this.animals = []
	}

	add(animal) {
		List.addIfNotPresent(this.animals, animal)
	}

	update() {
		for (const a of this.animals) {
			a.hunger += 0.2

			if (!a.touches(this)) {
				Move(a).towards(this.position.center, 1)
			}
		}
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
	}
}
