import { Loop } from '/static/engine/Loop.js'; 
import { StopWatch } from '/static/engine/StopWatch.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class After {
	constructor(intervalMs, action) {

				AssertNotNull(intervalMs, "argument intervalMs in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(action, "argument action in " + this.constructor.name + ".js should not be null")
			
		this.intervalMs = intervalMs; 
		this.action = action; 

		this.stopWatch = new StopWatch().start()
	}

	update() {
		if (this.stopWatch.time > this.intervalMs) {
			this.action()
			this.removeFromLoop()
		}
	}

	draw(draw) {
	}
}
