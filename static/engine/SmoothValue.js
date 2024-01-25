// if it reaches 99.5, it will be set to 100
// const s = new Smooth(0, 100, 0.01, 0.5);

// if it reaches 99.9, it will be set to 100
// const s = new Smooth(0, 100, 0.01, 0.1);

export class SmoothValue {
	constructor(currentValue, targetValue, smoothness, threshold=0.0001) {
		this.currentValue = currentValue
		this.targetValue = targetValue
		this.smoothness = smoothness
		this.threshold = threshold
	}

	update() {
		const diff = this.targetValue - this.currentValue

		if (Math.abs(diff) < this.threshold) {
			this.currentValue = this.targetValue
		}
		else {
			const delta = diff * this.smoothness

			this.currentValue += delta
		}

	}
}

