UnsecureRoute.createToken = async ({ }) => {
	return {
		encoded: await ShaToken.create(),
	}
}

UnsecureRoute.updateToken = async ({ body }) => {
	console.log("xxxxxxxxxxx")
	console.log(body)
	console.log("xxxxxxxxxxx")
	return {
		encoded: await ShaToken.update(body.encoded)
	}
}
