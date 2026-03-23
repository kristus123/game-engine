export function Enhance_js_Number() {
	Enhance(Number, "isStrictInteger", function () {
		return Number.isInteger(v) && !String(v).includes(".")
	})
	Enhance(Number, "round", function () {
		return Math.round(this)
	})
}


