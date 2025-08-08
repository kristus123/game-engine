import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { OnChange } from '/static/engine/on/OnChange.js'; 

// 'new' is prefixed in transpiler, just write new OnTrue(...)

export class OnTrue {
	constructor(condition, action) {

				AssertNotNull(condition, "argument condition in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(action, "argument action in " + this.constructor.name + ".js should not be null")
			
		this.condition = condition; 
		this.action = action; 

		// todo verify condition is a lambda
		this.onChange = new OnChange(condition, b => {
			if (b) {
				action(b)
			}
		})
	}

	update() {
		this.onChange.update()
	}

	draw(draw, guiDraw) {
		this.onChange.draw(draw, guiDraw)
	}
}
