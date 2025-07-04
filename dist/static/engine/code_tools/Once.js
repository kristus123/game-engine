import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Once {
	constructor(run) {

				AssertNotNull(run, "argument run in " + this.constructor.name + ".js should not be null")
			
		this.run = run; 

		run()
	}

	completed() {
		return true
	}
}
