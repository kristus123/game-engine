let Crypto = null
try {
	const crypto = await import("crypto")
	Crypto = crypto
}
catch (e) {
	Crypto = Assert.value(crypto)
}

export class Sha {

	static secret = null

	static sign(data) {
		Assert.string(this.secret)
		Assert.string(data)

		return Crypto
			.createHmac("sha256", this.secret)
			.update(data)
			.digest("base64url")
	}

	static isValid(e) {
		Assert.string(this.secret)

		const { internal, internalSignature } = TokenApi.splitEncoded(e)

		return Crypto.timingSafeEqual(
			Buffer.from(internalSignature),
			Buffer.from(this.sign(internal, this.secret)))
	}

	static assertValid(e) {
		if (this.isValid(e)) {
			return e
		}
		else {
			throw new Error("INVALID TOKEN")
		}
	}

}
