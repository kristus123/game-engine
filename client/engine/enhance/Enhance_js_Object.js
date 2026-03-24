export function Enhance_js_Object() {

	Enhance(Object, "merge", function (otherObject) {
		const overlapping = Object.keys(this).filter(key => key in otherObject)
		if (overlapping.length > 0) {
			throw new Error(`keys are overlapping while merging objects: ${overlapping.join(", ")}`)
		}

		return { ...this, ...otherObject }
	})

	Enhance(Object, "forEach", function (run) {
		for (const [key, value] of Object.entries(this)) {
 			run(key, value)
		}
	})


	Getter(Object, 'keys', function () {
		const r = []

		for (const k of Object.keys(this)) {
			r.add(k)
		}

		return r
	})

	Getter(Object, "values", function () {
		const r = []

		for (const v of Object.values(this)) {
			r.add(v)
		}

		return r
	})

	Enhance(Object, "assertKeyMissing", function (key) {
		if (Object.hasOwn(this, key)) {
			throw new Error("Key is present in object")
		}
	})

	Enhance(Object, "assertKeyNotPresent", function (key) {
		return this.assertKeyMissing(key)
	})

	Enhance(Object, "assertKeyPresent", function (key) {
		if (!Object.hasOwn(this, key)) {
			throw new Error("Key is not present in object")
		}
	})

	Getter(Object, "className", function () {
		return this.constructor.name
	})

}

