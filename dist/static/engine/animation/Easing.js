import { Easings } from '/static/engine/animation/Easings.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Easing {
	constructor(run) {

				AssertNotNull(run, "argument run in " + this.constructor.name + ".js should not be null")
			
		this.run = run; 


		this.start = 1000
		this.end = 0
		this.duration = 1000
		this.easing = Easings.easeInQuad

		this.startTime = null

		this.running = true
		this.startTime = performance.now()
	}

	update() {
		const elapsed = performance.now() - this.startTime
		const progress = Math.min(elapsed / this.duration, 1)
		const eased = this.easing(progress)
		const value = this.start + (this.end - this.start) * eased

		if (this.running) {
			this.run(value)
		}

		if (progress >= 1) {
			this.running = false
		}
	}
}

