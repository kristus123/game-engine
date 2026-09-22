export class Token {

	static encoded = LocalValue("ENCODED_TOKEN", "null")
	static decoded = null

	static async init() {
		const token = this.encoded.value == "null"
			? (await Assert.ok(await JsonHttpClient.createToken())).token
			: (await Assert.ok(await JsonHttpClient.updateToken())).token

		this.encoded.value = token
		this.decoded = ShaToken.decode(this.encoded.value)
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

		this.encoded.value = ShaToken.updateUnsafe(this.encoded.value, this.decoded)
		this.decoded = ShaToken.decode(this.encoded.value) // duplicated line
	}

}
