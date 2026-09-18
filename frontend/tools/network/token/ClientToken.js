export class ClientToken {

	static encodedToken = null
	static decodedToken = null

	static async init() {
		if (localStorage.getItem("encodedToken") == null) {
			const { encodedToken } = await Assert.ok(await JsonHttpClient.createToken())
			localStorage.setItem("encodedToken", Assert.value(encodedToken))
		}

		this.encodedToken = Assert.value(localStorage.getItem("encodedToken"))

		this.decodedToken = TokenApi.decode(this.encodedToken)
	}

	static updateUnsafe() {
		const [internal,
			internalSignature,
			_] = this.encodedToken.split(".")
		const unsafe = B64.encode(JSON.stringify(this.decodedToken.unsafe))
		localStorage.setItem("encodedToken", `${internal}.${internalSignature}.${unsafe}`)
	}
}
