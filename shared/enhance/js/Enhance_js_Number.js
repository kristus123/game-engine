export class Enhance_js_Number extends NativeEnhancer {

	constructor() {
		super(Number.prototype)
	}

	isStrictInteger() {
		return Number.isInteger(this) && !String(this).includes(".")
	}

	round() { // todo: rename to roundUp
		return Math.round(this)
	}

	roundDown() {
		return Math.floor(this)
	}

	get abs() {
		return Math.abs(this)
	}

}
