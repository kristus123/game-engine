export class Token {

	static encoded = LocalValue("ENCODED_TOKEN", "null")
	static decoded = null

	static async init() {
		const encoded = this.encoded.value == "null"
			? (await Assert.ok(await JsonHttpClient.createToken())).encoded
			: (await Assert.ok(await JsonHttpClient.updateToken({
				body: {
					encoded: this.encoded.value
				},
			}))).encoded

		this.encoded.value = encoded
		this.decoded = Tapi.decode(this.encoded.value)
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

	static async update(callback = (u) => {}) {
		const s = Tapi.splitEncoded(this.encoded.value)

		const unsafe = Tapi.decodeString(s.unsafe)
		await callback(unsafe)

		const { encoded } = await Assert.ok(await JsonHttpClient.updateToken({
			body: {
				encoded: Tapi.combine(s.internal, s.internalSignature, Tapi.encodeJson(unsafe)),
			},
		}))

		this.encoded.value = encoded
		this.decoded = Tapi.decode(this.encoded.value) // duplicated line
	}

}
