import { Loop } from '/static/engine/Loop.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Every {
	constructor(intervalMs, action, maxRuns=null, onFinish=() => {}) {

				AssertNotNull(intervalMs, "argument intervalMs in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(action, "argument action in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(maxRuns, "argument maxRuns in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onFinish, "argument onFinish in " + this.constructor.name + ".js should not be null")
			
		this.intervalMs = intervalMs; 
		this.action = action; 
		this.maxRuns = maxRuns; 
		this.onFinish = onFinish; 

		this.intervalMs = intervalMs
		this.action = action
		this.lastTrigger = performance.now()

		this.runs = 0
	}

	update() {
		if (this.maxRuns && this.runs >= this.maxRuns) {
			this.onFinish()
			this.removeFromLoop()
		}
		else {
			const now = performance.now()
			if (now - this.lastTrigger >= this.intervalMs) {
				this.action()
				this.runs += 1
				this.lastTrigger = now
			}
		}
	}

	draw(draw, guiDraw) {
		// optional rendering stuff
	}
}

