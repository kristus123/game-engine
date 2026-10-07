UnsecureRoute.createToken = async ({ }) => {
	return {
		encoded: await ShaToken.create(),
	}
}

UnsecureRoute.updateToken = async ({ body }) => {
	return {
		encoded: await ShaToken.update(body.encoded)
	}
}
