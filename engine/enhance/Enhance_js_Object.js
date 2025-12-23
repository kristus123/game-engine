export function Enhance_js_Object() {

	Enhance(Object, 'merge', function (otherObject) {
		const overlapping = Object.keys(this).filter(key => key in otherObject);
		if (overlapping.length > 0) {
			throw new Error(`keys are overlapping while merging objects: ${overlapping.join(', ')}`);
		}

		return { ...this, ...otherObject };
	})

}
