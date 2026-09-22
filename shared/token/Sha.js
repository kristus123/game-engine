export class Sha {

	static secret = "CHANGE_ME"

	static async sign(data) {
		Assert.string(this.secret)
		Assert.string(data)

		const key = await crypto.subtle.importKey(
			"raw",
			new TextEncoder().encode(this.secret),
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["sign"]
		)

		const signature = await crypto.subtle.sign(
			"HMAC",
			key,
			new TextEncoder().encode(data)
		)

		return Buffer.from(signature).toString("base64url")
	}

	static async isValid(e) {
		Assert.string(this.secret)

		const { internal, internalSignature } = ShaToken.splitEncoded(e)

		return internalSignature == await this.sign(internal)
	}

	static async assertValid(e) {
		if (await this.isValid(e)) {
			return e
		}

		throw new Error("INVALID TOKEN")
	}

}
