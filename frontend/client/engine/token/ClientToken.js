export class ClientToken {

	static encoded = null
	static decoded = null

	static async init() {
		if (localStorage.getItem("encodedToken") == null) {
			console.log("creating new token")
			const body = await HttpClient.createToken({})
			Assert.value(body.token)
			localStorage.setItem("encodedToken", body.token)
		}
		else {
			console.log("token already present baby")
		}

		const encodedToken = localStorage.getItem("encodedToken")
		Assert.value(encodedToken)

		this.encodedToken = encodedToken

		const [
			internalData,
			internalDataSignature,
			unsafeData,
		] = encodedToken.split(".")

		this.decoded = {
			internal: JSON.parse(Base64.decode(internalData)),
			unsafe: JSON.parse(Base64.decode(unsafeData)),
		}
	}

	static remove() {
		if (localStorage.getItem("encodedToken")) {
			localStorage.removeItem("encodedToken")
		}
		else {
			throw new Error("Token can't be deleted as there is no token stored")
		}
	}
}
