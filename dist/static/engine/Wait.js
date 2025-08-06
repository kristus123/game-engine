import { StopWatch } from '/static/engine/StopWatch.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Wait {

	constructor(ms) {

				AssertNotNull(ms, "argument ms in " + this.constructor.name + ".js should not be null")
			
		this.ms = ms; 

		this.s = new StopWatch().start()
	}

	completed() {
		return this.s.time > this.ms
	}

}
