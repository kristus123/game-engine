export class PingPong {
	constructor(run) {
		this.start = 0
		this.end = 10
		this.duration = 100
		this.easing = Easings.easeInOutQuad

		this.bounceAtStart = false
		this.bounceAtEnd = true

		this.run = run

		this.startTime = performance.now()
		this.running = true
		this.direction = 1
		this.phase = 0
	}

	update() {
		const now = performance.now()
		const elapsed = now - this.startTime
		const progress = Math.min(elapsed / this.duration, 1)

		let easedProgress
		if (this.direction === 1) {
			easedProgress = this.bounceAtEnd
				? Easings.overshootOut(progress)
				: this.easing(progress)
		}
		else {
			easedProgress = this.bounceAtStart
				? Easings.overshootOut(progress)
				: this.easing(progress)
		}

		const value = this.direction === 1
			? this.start + (this.end - this.start) * easedProgress
			: this.end - (this.end - this.start) * easedProgress

		this.run(value)

		if (progress >= 1) {
			if (this.phase === 0) {
				this.phase = 1
				this.direction = -1
				this.startTime = now
			}
			else {
				this.running = false
			}
		}
	}
}
