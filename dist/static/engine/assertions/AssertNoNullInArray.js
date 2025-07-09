import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export function AssertNoNullInArray(array) {
	AssertNotNull(array)

	for (const o of array) {
		AssertNotNull(o)
	}
}
