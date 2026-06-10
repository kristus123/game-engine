import crypto from "crypto"

const SECRET = "CHANGE_ME"

function signSha256(data) {
	return crypto
		.createHmac("sha256", SECRET)
		.update(data)
		.digest("base64url")
}

function decodeBase64(encoded) {
	return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))
}

function encodeBase64(payload) {
	return Buffer.from(JSON.stringify(payload)).toString("base64url")
}

export class ServerToken {

	static create({ internal, unsafe } = {}) {

		const internalData = encodeBase64(internal)
		const internalDataSignature = signSha256(internalData)

		const unsafeData = encodeBase64(unsafe)

		return `${internalData}.${internalDataSignature}.${unsafeData}`
	}

	static decode(token) {
		try {
			const [
				internalData,
				internalDataSignature,
				unsafeData,
			] = token.split(".")

			const expected = signSha256(internalData)

			const valid = crypto.timingSafeEqual(
				Buffer.from(internalDataSignature),
				Buffer.from(expected))

			if (valid) {
				return {
					internal: decodeBase64(internalData),
					unsafe: decodeBase64(unsafeData),
				}
			}
			else {
				throw new Error("INVALID TOKEN")
			}
		}
		catch (e) {
			throw new Error("INVALID TOKEN: " + e)
		}
	}
}
