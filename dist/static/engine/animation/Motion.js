import { Easings } from '/static/engine/animation/Easings.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Motion {
	constructor(startValue = 10, end = 1, duration = 500, easing = Easings.bounceOut, exponent = 4, pingPong = false, infiniteLoop = false, totalRepeats = 0, onFinish = () => {}, bounceAtStart = Easings.linear, bounceAtEnd = Easings.linear) {

				AssertNotNull(startValue, "argument startValue in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(end, "argument end in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(duration, "argument duration in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(easing, "argument easing in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(exponent, "argument exponent in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(pingPong, "argument pingPong in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(infiniteLoop, "argument infiniteLoop in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(totalRepeats, "argument totalRepeats in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onFinish, "argument onFinish in " + this.constructor.name + ".js should not be null")
			
		this.startValue = startValue; 
		this.end = end; 
		this.duration = duration; 
		this.easing = easing; 
		this.exponent = exponent; 
		this.pingPong = pingPong; 
		this.infiniteLoop = infiniteLoop; 
		this.totalRepeats = totalRepeats; 
		this.onFinish = onFinish; 

		this.startValue = startValue
		this.value = this.startValue

		this.duration = Math.max(1, duration)
		this.totalRepeats = Math.max(0, Math.floor(totalRepeats))

		this._reset()
	}

	_reset() {
		this.startTime = performance.now()
		this.elapsed = 0
		this.direction = 1
		this.remainingRepeats = this.totalRepeats
		this.isPlaying = false
	}

	start() {
		this._reset()

		this.isPlaying = true
	}

	stop() {
		this.isPlaying = false
	}

	update() {
		if (!this.isPlaying) {
			return
		}

		const now = performance.now()
		this.elapsed = now - this.startTime
		console.log(this.elapsed)
		let rawProgress = this.elapsed / this.duration

		if (rawProgress >= 1) {
			if (this.pingPong) {
				this.direction *= -1
				this.startTime = now
				rawProgress = 0
			}
			else if (this.infiniteLoop || this.remainingRepeats > 0) {
				console.log(this.infiniteLoop)
				if (this.remainingRepeats > 0) {
					this.remainingRepeats--
				}
				this.startTime = now
				rawProgress = 0
			}
			else {
				this.isPlaying = false
				this.onFinish()
				return
			}
		}

		const easingType = this.easingToUse()
		const easedProgress = easingType(rawProgress)
		this.value = this.direction === 1
			? this.startValue + (this.end - this.startValue) * easedProgress
			: this.end - (this.end - this.startValue) * easedProgress
	}

	 easingToUse() {
		if (this.direction === 1 && this.bounceAtEnd) {
			return this.bounceAtEnd
		}
		if (this.direction === -1 && this.bounceAtStart) {
			return this.bounceAtStart
		}
		else {
			return this.easing
		}
	}
}

