import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 

export class MouseResize {
	constructor(objectToResize) {

				AssertNotNull(objectToResize, "argument objectToResize in " + this.constructor.name + ".js should not be null")
			
		this.objectToResize = objectToResize; 

	}

	update() {
		if (Mouse.down) {

		}
	}

	draw(draw, guiDraw) {
	}
}
