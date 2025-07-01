import { AssertArray } from '/static/engine/assertions/AssertArray.js'; 
import { AssertNoNullInArray } from '/static/engine/assertions/AssertNoNullInArray.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Collision } from '/static/engine/core/physics/Collision.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 

export class DeliveryZone extends StaticGameObject {
	constructor(position, objectsToDeliver=[]) {
		super(position, '')

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(objectsToDeliver, "argument objectsToDeliver in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.objectsToDeliver = objectsToDeliver; 


		AssertArray(objectsToDeliver)
		AssertNoNullInArray(objectsToDeliver)

		this.deliveredObjects = []
	}

	completed() {
		return this.deliveredObjects.length == this.objectsToDeliver.length
	}


	inside(o) {
		return Collision.between(this, o)
	}

	get amountDelivered() {
		return this.deliveredObjects.length
	}

	update() {
		for (const o of this.objectsToDeliver) {
			if (Collision.between(this, o) && !List.includes(this.deliveredObjects, o)) {
				this.deliveredObjects.push(o)
			}
		}

		for (const o of this.deliveredObjects) {
			o.velocity.x = 0
			o.velocity.y = 0
		}
	}

	draw(draw, guiDraw) {
		draw.transparentGreenRectangle(this.position)
	}

}
