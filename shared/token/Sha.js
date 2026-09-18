export class Sha {

	static secret = null

	static sign(data) {
		Assert.value(this.secret)

		return crypto
			.createHmac("sha256", this.secret)
			.update(data)
			.digest("base64url")
	}

	static assertValid(internalData, internalSignature) {
		Assert.value(this.secret)

		const valid = crypto.timingSafeEqual(
			Buffer.from(internalSignature),
			Buffer.from(this.sign(internalData, this.secret)))
		if (valid) {
			// ok
		}
		else {
			throw new Error("INVALID TOKEN")
		}

	}
}
