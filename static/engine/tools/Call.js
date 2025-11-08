// Only use this inside of a class like
// Call(this.onHit)
// NOT
// Call(o.onHit)
// That won't work
// to fix it you need to bind object

// this class can just be deleted it is garbage 
// https://chat.openai.com/share/123d17a0-321b-461f-80b9-f8eedb7ae687

export const Call = method => {
	if (method) {
		method()
	}
	else {
		console.log('Method not present')
		// throw new Error(methodName + ' is not implemented')
	}
}
