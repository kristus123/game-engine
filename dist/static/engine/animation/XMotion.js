import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class XMotion {
    constructor(startValue = 0, endValue = 100, easingFactor = 0.1) {

				AssertNotNull(startValue, "argument startValue in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(endValue, "argument endValue in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(easingFactor, "argument easingFactor in " + this.constructor.name + ".js should not be null")
			
		this.startValue = startValue; 
		this.endValue = endValue; 
		this.easingFactor = easingFactor; 

        this.startValue = startValue;
        this.endValue = endValue;
        this.value = this.startValue;
        this.easingFactor = easingFactor; // fraction of distance per update
        this.playing = false;
    }

    start() {
        this.value = this.startValue;
        this.playing = true;
    }

    update(distance) {
        if (!this.playing) return;

        // move value toward endValue proportional to distance
        this.value += (this.endValue - this.value) * this.easingFactor * distance;

        // stop if close enough
        if (Math.abs(this.endValue - this.value) < 0.001) {
            this.value = this.endValue;
            this.playing = false;
        }
    }
}

