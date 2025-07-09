import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

export class Cargo extends DynamicGameObject {
	constructor(objects=[], connectedTo) {
		super(new Position(0, 0), 10, 10)

				AssertNotNull(objects, "argument objects in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(connectedTo, "argument connectedTo in " + this.constructor.name + ".js should not be null")
			
		this.objects = objects; 
		this.connectedTo = connectedTo; 

	}

	update() {
		for (const o of this.objects) {
			ForcePush(o).towards(this, 10)
		}

		ForcePush(this).towards(this.connectedTo, 10)
	}


	draw(draw, guiDraw) {
		draw.transparentGreenRectangle(this.position)
	}

}
