import { randomUUID } from "crypto"

Sha.secret = "CHANGE_ME" // todo change

export class ServerToken {

	static create() {
		return Sha.assertValid(TokenApi.encode({
			internal: {
				userId: randomUUID(),
				role: "ROLE_USER",
			},
			unsafe: {
				name: "Your username",
				age: "Your age",
			},
		}))
	}

	static decode(encoded) {
		Sha.assertValid(encoded)
		return TokenApi.decode(encoded)
	}

	static update(encoded) {
		Sha.assertValid(encoded)

		const decoded = TokenApi.decode(encoded)

		if (AdminUserId(decoded.internal.userId)) {
			decoded.internal.role = "ROLE_ADMIN"
		}
		else {
			decoded.internal.role = "ROLE_USER"
		}

		return TokenApi.encode(internal, unsafe)
	}

}
