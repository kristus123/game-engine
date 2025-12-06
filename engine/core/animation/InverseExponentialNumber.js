export class InverseExponentialNumber {
	constructor(start, end, rate = 0.1, threshold = 1) {
		this._value = start
	}

	next() {
		this._value -= (this._value - this.end) * this.rate

		if (Math.abs(this._value - this.end) <= this.threshold) {
			this._value = this.end
		}
	}

	get value() {
		return Math.round(this._value)
	}
}

