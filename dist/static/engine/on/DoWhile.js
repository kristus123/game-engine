import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class While {
	constructor(condition, action) {

				AssertNotNull(condition, "argument condition in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(action, "argument action in " + this.constructor.name + ".js should not be null")
			
		this.condition = condition; 
		this.action = action; 

	}

	update() {
		if (this.condition()) {
			this.action()
		}
	}
}
