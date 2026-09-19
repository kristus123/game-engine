import { randomUUID } from "crypto"

Sha.secret = "CHANGE_ME" // todo change

export class ServerToken {

	static create() {
		const internal = B64.encode(JSON.stringify({
			userId: randomUUID(),
		}))

		const unsafe = B64.encode(JSON.stringify({
			name: "Your username",
			age: "Your age",
		}))

		return `${internal}.${Sha.sign(internal)}.${unsafe}`
	}

	static decode(encoded) {
		Sha.assertValid(encoded)

		return TokenApi.decode(encoded)
	}

}
