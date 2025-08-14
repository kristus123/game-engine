import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Every {
	constructor(intervalMs, action) {

				AssertNotNull(intervalMs, "argument intervalMs in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(action, "argument action in " + this.constructor.name + ".js should not be null")
			
		this.intervalMs = intervalMs; 
		this.action = action; 

		this.intervalMs = intervalMs
		this.action = action
		this.lastTrigger = performance.now()
	}

	update() {
		const now = performance.now()
		if (now - this.lastTrigger >= this.intervalMs) {
			this.action()
			this.lastTrigger = now
		}
	}

	draw(draw, guiDraw) {
		// optional rendering stuff
	}
}

