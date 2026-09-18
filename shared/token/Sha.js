export class Sha {

	static signSha256(data, secret) {
		return crypto
			.createHmac("sha256", secret)
			.update(data)
			.digest("base64url")
	}

	static assertTimingSafe(internalData, internalSignature, secret) {
		const valid = crypto.timingSafeEqual(
			Buffer.from(internalSignature),
			Buffer.from(this.sign(internalData, secret)))
		if (valid) {
			// ok
		}
		else {
			throw new Error("INVALID TOKEN")
		}
		
	}
}
