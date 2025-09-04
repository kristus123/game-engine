import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class InverseExponentialNumber {
	constructor(start, end, rate = 0.1, threshold = 1) {

				AssertNotNull(start, "argument start in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(end, "argument end in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(rate, "argument rate in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(threshold, "argument threshold in " + this.constructor.name + ".js should not be null")
			
		this.start = start; 
		this.end = end; 
		this.rate = rate; 
		this.threshold = threshold; 

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

