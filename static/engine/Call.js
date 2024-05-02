export const Call = (methodName) => {
	if (methodName) {
		methodName()
	}
	else {
		// throw new Error(methodName + ' is not implemented')
	}
}
