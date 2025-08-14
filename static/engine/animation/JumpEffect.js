export class JumpEffect {
	constructor(
		duration = 1000,
		startValue = 4,
		endValue = 1,
		onMidpoint = null,
		onComplete = null
	) {
		this.duration = duration;
		this.startValue = startValue;
		this.endValue = endValue;
		this.onMidpoint = onMidpoint;
		this.onComplete = onComplete;

		this.value = startValue;
		this.running = true;
		this.midpointTriggered = false;
		this.startTime = performance.now();
	}

	reset() {
	this.value = this.startValue;
	this.running = true;
	this.midpointTriggered = false;
	this.startTime = performance.now();
}


	update() {
		if (!this.running) return;

		let elapsed = performance.now() - this.startTime;
		let t = Math.min(elapsed / this.duration, 1); // 0..1

		// Hardcoded easing
		let eased = Easings.easeInOutQuad(t);

		// Map easing 0..1 → startValue..endValue
		let prevValue = this.value;
		this.value = this.startValue + (this.endValue - this.startValue) * eased;

		// Midpoint trigger (halfway between start and end)
		const midpointValue = (this.startValue + this.endValue) / 2;
		if (!this.midpointTriggered && prevValue < midpointValue && this.value >= midpointValue) {
			this.midpointTriggered = true;
			if (this.onMidpoint) this.onMidpoint();
		}

		// End trigger
		if (t >= 1) {
			this.running = false;
			if (this.onComplete) this.onComplete();
		}
	}
}

