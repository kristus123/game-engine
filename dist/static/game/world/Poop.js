import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { D } from '/static/game/world/D.js'; 

export class Poop extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 40
		this.position.height = 40

		this.localObjects = new LocalObjects([
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.brown(this)

		if (Mouse.hovering(this)) {
			this.remove()
		}
	}
}
