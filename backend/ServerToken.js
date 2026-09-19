import { randomUUID } from "crypto"

Sha.secret = "CHANGE_ME" // todo change

export class ServerToken {

	static create() {
		const internal = B64.encode({
			userId: randomUUID(),
		})

		const unsafe = B64.encode({
			name: "Your username",
			age: "Your age",
		})

		return `${internal}.${Sha.sign(internal)}.${unsafe}`
	}

	static decode(encoded) {
		const decoded = TokenApi.decode(encoded)
		Sha.assertValid(decoded.internal, decoded.internalSignature)
		return decoded
	}

}
