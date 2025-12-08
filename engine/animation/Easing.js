export class Easing {
	constructor(easing = Easings.easeOutQuad, run = () => {}) {
		this.easing = easing
		this.run = run

		this.startValue = 8
		this.value = this.startValue
		this.end = 1
		this.duration = 500

		this.running = false
		this.startTime = null
	}

	start() {
		this.reset()

		this.startTime = performance.now()
		this.running = true
	}

	reset() {
		this.value = this.startValue
		this.running = false
		this.startTime = null
	}

	update() {
		if (!this.running) {
			return
		}

		const elapsed = performance.now() - this.startTime
		const progress = Math.min(elapsed / this.duration, 1)
		const eased = this.easing(progress)
		this.value = this.startValue + (this.end - this.startValue) * eased

		if (this.running) {
			this.run(this.value)
		}

		if (progress >= 1) {
			this.running = false
			this.end = this.end
		}
	}
}

