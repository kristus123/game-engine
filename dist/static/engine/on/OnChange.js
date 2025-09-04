import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

// 'new' is prefixed in transpiler, just write new OnChange(...)

export class OnChange {
	constructor(condition, action) {

				AssertNotNull(condition, "argument condition in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(action, "argument action in " + this.constructor.name + ".js should not be null")
			
		this.condition = condition; 
		this.action = action; 

		// todo verify condition is a lambda
		this.lastCondition = condition()
	}

	update() {
		const currentCondition = this.condition()

		if (this.lastCondition != currentCondition) {
			this.action(currentCondition)
			this.lastCondition = currentCondition
		}
	}

	draw(draw) {
	}
}
