import crypto from "crypto"
import { randomUUID } from "crypto"

const SECRET = "CHANGE_ME"

export class ServerToken {

	static create() {
		const internal = BaseencodeBase64({
			userId: randomUUID(),
		})
		const internalSignature = Sha.sign(internal, SECRET)

		const unsafe = encodeBase64({
			name: "Your username",
			age: "Your age",
		})

		return `${internal}.${internalSignature}.${unsafe}`
	}

	static decode(token) {
		try {
			const [
				internalData,
				internalSignature,
				unsafe,
			] = token.split(".")

			Sha.assertTimingSafe(internalData, internalSignature)

			return {
				internal: B64.decode(internalData),
				unsafe: B64.decode(unsafe),
			}
		}
		catch (e) {
			throw new Error("INVALID TOKEN: " + e)
		}
	}
}
