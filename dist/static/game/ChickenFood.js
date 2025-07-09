import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { D } from '/static/game/world/D.js'; 

export class ChickenFood extends DynamicGameObject {
	constructor(position) {
		super(position, 2000, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 20
		this.position.height = 20
	}

	draw(draw, guiDraw) {
		draw.orange(this.position)
	}
}
