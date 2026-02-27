class CurveImplementation {
	constructor(start = 0, end = 1, duration = 1000, type = "linear", exponent = 2, onFinish = () => {}) {
		this.start = start
		this.end = end
		this.duration = duration
		this.type = type
		this.exponent = exponent
		this.onFinish = onFinish

		this.elapsed = 0
		this.value = start
		this.lastTime = performance.now()
		this.finished = false
	}

	update() {
		if (this.finished) {
			return this.value
		}

		const now = performance.now()
		const deltaTime = now - this.lastTime
		this.lastTime = now

		this.elapsed += deltaTime
		const t = Math.min(this.elapsed / this.duration, 1)

		switch (this.type) {
		case "linear":
			this.value = this.start + (this.end - this.start) * t
			break
		case "exponential":
			this.value = this.start + (this.end - this.start) * Math.pow(t, this.exponent)
			break
		case "quadratic":
			this.value = this.start + (this.end - this.start) * (t * t)
			break
		case "logarithmic":
			this.value = this.start + (this.end - this.start) * Math.log10(1 + 9 * t)
			break
		default:
			this.value = this.start + (this.end - this.start) * t
		}

		if (t >= 1 && !this.finished) {
			this.finished = true
			if (this.onFinish) {
				this.onFinish(this.value)
			}
		}

		return this.value
	}

	isFinished() {
		return this.finished
	}
}

export class Curve {
	static linear(start, end, duration, onFinish = () => {}) {
		return new CurveImplementation(start, end, duration, "linear", onFinish)
	}

	static exponential(start, end, duration, exponent = 2, onFinish = () => {}) {
		return new CurveImplementation(start, end, duration, "exponential", exponent, onFinish)
	}

	static quadratic(start, end, duration, onFinish = () => {}) {
		return new CurveImplementation(start, end, duration, "quadratic", onFinish)
	}

	static logarithmic(start, end, duration, onFinish = () => {}) {
		return new CurveImplementation(start, end, duration, "logarithmic", onFinish)
	}
}

