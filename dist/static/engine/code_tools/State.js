import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class State { // todo better name
	constructor(scenarios) {

				AssertNotNull(scenarios, "argument scenarios in " + this.constructor.name + ".js should not be null")
			
		this.scenarios = scenarios; 

		this.active = null
	}

	update() {
		// if (this.active) {
		// 	this.active.update()
		// }
	}

	draw(draw, guiDraw) {
		for (const scenario of this.scenarios) {
			if (scenario.condition()) {
				scenario.update()
				scenario.draw(draw, guiDraw)
				break
			}
		}

	}

}
