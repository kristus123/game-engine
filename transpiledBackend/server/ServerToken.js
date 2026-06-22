
import crypto from "crypto"
import { randomUUID } from "crypto"

const SECRET = "CHANGE_ME"

function signSha256(data) {
			Assert.notNull(data, 'param 1 - data - ServerToken.signSha256')
	return crypto
		.createHmac("sha256", SECRET)
		.update(data)
		.digest("base64url")
}

function decodeBase64(encoded) {
			Assert.notNull(encoded, 'param 1 - encoded - ServerToken.decodeBase64')
	return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))
}

function encodeBase64(payload) {
			Assert.notNull(payload, 'param 1 - payload - ServerToken.encodeBase64')
	return Buffer.from(JSON.stringify(payload)).toString("base64url")
}

export class ServerToken {

	static create() {
		const internal = {
			userId: randomUUID(),
		}

		const unsafe = {
			name: "Your username",
			age: "Your age",
		}

		const internalData = encodeBase64(internal)
		const internalDataSignature = signSha256(internalData)

		const unsafeData = encodeBase64(unsafe)

		return `${internalData}.${internalDataSignature}.${unsafeData}`
	}

	static decode(token) {
			Assert.notNull(token, 'param 1 - token - ServerToken.decode')
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
