import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Killed } from '/static/engine/chicken_stuff/Killed.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { D } from '/static/game/world/D.js'; 

export class DeadChicken extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position = this.position.copy()

		this.position.width = 20
		this.position.height = 20

		this.localObjects = new LocalObjects([
			new Killed(position),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.orange(this.position)
	}
}
