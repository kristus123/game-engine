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

function encodeJson(payload) {
	return Buffer.from(JSON.stringify(payload)).toString("base64url")
}

export class ServerJwt {

	static create({ internalJson, clientJson } = {}) {

		const signature = signSha256(immutableData)
		const immutableData = encodeJson(internalJson)
		const mutableData = encodeJson(clientJson)

		return `${signature}.${immutableData}.${mutableData}`
	}

	static decode(token) {
		try {
			const [
				signature,
				immutableData,
				mutableData,
			] = token.split(".")

			const expected = signSha256(immutableData)

			const valid = crypto.timingSafeEqual(
				Buffer.from(signature),
				Buffer.from(expected))

			if (valid) {
				return {
					immutableData: decodeBase64(immutableData),
					mutableData: decodeBase64(mutableData),
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

const token = ServerJwt.create({
	internalJson: { 1: 2 },
	clientJson: { 1: 2 },
})

console.log(token)
console.log(ServerJwt.decode(token))
