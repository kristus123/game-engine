import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class ScreenPosition {
	constructor(position) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

	}

	get x() {
	}

	get y() {
	}

}
