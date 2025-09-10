import { StopWatch } from '/static/engine/StopWatch.js'; 
import { Easings } from '/static/engine/animation/Easings.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Motion {
	constructor(startValue = 4, end = 1, duration = 400, easing = Easings.bounce) {

				AssertNotNull(startValue, "argument startValue in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(end, "argument end in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(duration, "argument duration in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(easing, "argument easing in " + this.constructor.name + ".js should not be null")
			
		this.startValue = startValue; 
		this.end = end; 
		this.duration = duration; 
		this.easing = easing; 

		this.value = this.startValue
		this.duration = Math.max(1, duration)
		this.playing = false
	}

	start() {
		this.value = this.startValue
		this.elapsed = new StopWatch().start()
		this.playing = true
	}

	update() {
		if (this.playing) {
			const e = this.elapsed.value

			let progress = Math.min(e / this.duration, 1)

			this.value = this.startValue + (this.end - this.startValue) * this.easing(progress)

			if (progress <= 1) {
				// this.playing = false;
			}
		}
	}
}
