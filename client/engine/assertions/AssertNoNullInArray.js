export function AssertNoNullInArray(array) {
	AssertNotNull(array)

	for (const o of array) {
		AssertNotNull(o)
	}
}
