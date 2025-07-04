import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Loop } from '/static/engine/core/Loop.js'; 

export class RunOnce {
	constructor(run) {

				AssertNotNull(run, "argument run in " + this.constructor.name + ".js should not be null")
			
		this.run = run; 

		run()
		this.removeFromLoop()
	}
}
