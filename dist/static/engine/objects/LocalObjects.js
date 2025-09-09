import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { AllObjects } from '/static/engine/objects/AllObjects.js'; 

export class LocalObjects extends AllObjects {
	constructor(objects=[]) {
		super(objects)

				AssertNotNull(objects, "argument objects in " + this.constructor.name + ".js should not be null")
			
		this.objects = objects; 

	}
}
