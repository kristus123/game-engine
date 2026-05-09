export function Enhance_js_Object() {

	Enhance(Object.prototype, "merge", function (otherObject) {
		const overlapping = Object.keys(this).filter(key => key in otherObject)
		if (overlapping.length > 0) {
			throw new Error(`keys are overlapping while merging objects: ${overlapping.join(", ")}`)
		}

		return { ...this, ...otherObject }
	})

	Enhance(Object.prototype, "forEach", function (run) {
		for (const [key, value] of Object.entries(this)) {
 			run(key, value)
		}

		return this
	})

	Getter(Object.prototype, "all", function () {
		return Object.entries(this)
	})


	Getter(Object.prototype, "keys", function () {
		const r = []

		for (const k of Object.keys(this)) {
			r.add(k)
		}

		return r
	})

	Getter(Object.prototype, "values", function () {
		const r = []

		for (const v of Object.values(this)) {
			r.add(v)
		}

		return r
	})

	Enhance(Object.prototype, "assertKeyMissing", function (key) {
		if (Object.hasOwn(this, key)) {
			throw new Error("Key is present in object")
		}
		else {
			return this
		}
	})

	Enhance(Object.prototype, "assertKeyNotPresent", function (key) {
		return this.assertKeyMissing(key)
	})

	Enhance(Object.prototype, "assertKeyPresent", function (key) {
		if (!Object.hasOwn(this, key)) {
			throw new Error("Key is not present in object")
		}
		else {
			return this
		}
	})

	Getter(Object.prototype, "className", function () {
		return this.constructor.name
	})

}

