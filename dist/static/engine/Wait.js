import { StopWatch } from '/static/engine/StopWatch.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 

// used for Quest.js

export class Wait {

	constructor(ms, onStart=() => {}) {

				AssertNotNull(ms, "argument ms in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onStart, "argument onStart in " + this.constructor.name + ".js should not be null")
			
		this.ms = ms; 
		this.onStart = onStart; 

		this.s = new StopWatch().start()
	}

	completed() {
		if (this.s.time > this.ms) {
			onStart()
		}
	}

}
