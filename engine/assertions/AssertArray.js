export function AssertArray(x) {
	if (NotArray(x)) {
		throw new Error('THIS IS NOT AN ARRAY')
	}
}
