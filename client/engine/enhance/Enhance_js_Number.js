export function Enhance_js_Number() {

	Enhance(Number.prototype, "isStrictInteger", function () {
		return Number.isInteger(v) && !String(v).includes(".")
	})

	Enhance(Number.prototype, "round", function () { // todo: rename to roundUp
		return Math.round(this)
	})

	Enhance(Number.prototype, "roundDown", function () {
		return Math.floor(this)
	})
}
