export class Token {

	static encoded = LocalValue("ENCODED_TOKEN", "null")
	static decoded = null

	static async init() {
		Assert.string(this.encoded.value)

		if (this.encoded.value == "null") {
			console.log("calling creatoken")
			const { token } = await Assert.ok(await JsonHttpClient.createToken())
			this.encoded.value = Assert.string(token)
		}

		this.decoded = TokenApi.decode(this.encoded.value) // duplicated line
	}

	static get role() {
		return Assert.string(this.decoded.internal.role)
	}

	static get admin() {
		return this.role == "ROLE_ADMIN"
	}

	static get user() {
		return this.role == "ROLE_USER"
	}

	static get username() {
		return Assert.string(this.decoded.unsafe.username)
	}

	static set username(newUsername) {
		this.decoded.unsafe.username = Assert.string(newUsername)

		this.encoded.value = TokenApi.updateUnsafe(this.encoded.value, this.decoded)
		this.decoded = TokenApi.decode(this.encoded.value) // duplicated line
	}

}
