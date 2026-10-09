export class Sha {

	static async sign(data) {
		const secret = ServerConfig.shaSecret
		Assert.string(secret)
		Assert.string(data)

		const key = await crypto.subtle.importKey(
			"raw",
			new TextEncoder().encode(secret),
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
		Assert.string(e)
		Assert.string(ServerConfig.shaSecret)

		const { internal, internalSignature } = Tapi.splitEncoded(e)

		return internalSignature == await this.sign(internal)
	}

	static async assertValid(e) {
		Assert.string(e)
		Assert.string(ServerConfig.shaSecret)

		if (await this.isValid(e)) {
			return e
		}
		else {
			throw new Error("INVALID TOKEN")
		}
	}

}
