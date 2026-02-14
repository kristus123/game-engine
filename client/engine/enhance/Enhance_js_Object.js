export function Enhance_js_Object() {

	Enhance(Object, 'merge', function (otherObject) {
		const overlapping = Object.keys(this).filter(key => key in otherObject)
		if (overlapping.length > 0) {
			throw new Error(`keys are overlapping while merging objects: ${overlapping.join(', ')}`)
		}

		return { ...this, ...otherObject }
	})

	Enhance(Object, 'forEach', function (run) {
		for (const [key, value] of Object.entries(this)) {
 			run(key, value)
		}
	})

	Enhance(Object, 'assertKeyMissing', function (key) {
		if (Object.hasOwn(this, key)) {
			throw new Error('Key is present in object')
		}
	})

}

