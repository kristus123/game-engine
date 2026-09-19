import crypto from "crypto"

export class Sha {

	static secret = null

	static sign(data) {
		Assert.string(data)

		Assert.value(this.secret)

		return crypto
			.createHmac("sha256", this.secret)
			.update(data)
			.digest("base64url")
	}

	static assertValid(e) {
		Assert.value(this.secret)

		const { internal, internalSignature } = TokenApi.splitEncoded(e)

		const valid = crypto.timingSafeEqual(
			Buffer.from(internalSignature),
			Buffer.from(this.sign(internal, this.secret)))

		if (valid) {
			// ok
		}
		else {
			throw new Error("INVALID TOKEN")
		}

	}

}
