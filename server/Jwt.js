import crypto from "crypto"

const SECRET = "CHANGE_ME"

export class Jwt {

	static encode(payload) {
		return Buffer.from(JSON.stringify(payload)).toString("base64url")
	}

	static decode(encoded) {
		return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))
	}

	static sign(data) {
		return crypto
			.createHmac("sha256", SECRET)
			.update(data)
			.digest("base64url")
	}

	static create(payload) {
		const encoded = this.encode(payload)
		const signature = this.sign(encoded)
		const data = this.sign(encoded)

		return `${encoded}.${signature}.${data}`
	}

	static verify(token) {
		try {
			const [encoded,
				signature,
				data] = token.split(".")

			const expected = this.sign(encoded)

			const valid = crypto.timingSafeEqual(
				Buffer.from(signature),
				Buffer.from(expected))

			if (valid) {
				return this.decode(encoded)
			}
			else {
				throw new Error("INVALID")

			}
		}
		catch (e) {
			throw new Error(e)
		}
	}
}
