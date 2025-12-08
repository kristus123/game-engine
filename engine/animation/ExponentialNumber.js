export class ExponentialNumber {
	constructor(start, end, rate = 0.1, threshold = 1) {
		this._value = start
	}

	next() {
		this._value += (this.end - this._value) * this.rate

		if (Math.abs(this.end - this._value) <= this.threshold) {
			this._value = this.end
		}
	}


	get value() {
		return Math.round(this._value)
	}
}

