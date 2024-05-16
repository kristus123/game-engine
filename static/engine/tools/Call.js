export const Call = method => {
	if (method) {
		method()
	}
	else {
		// throw new Error(methodName + ' is not implemented')
	}
}
