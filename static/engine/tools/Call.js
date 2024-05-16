export const Call = method => {
	if (method) {
		method()
	}
	else {
		console.log("Method not present")
		// throw new Error(methodName + ' is not implemented')
	}
}
