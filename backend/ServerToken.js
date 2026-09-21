import { randomUUID } from "crypto"

Sha.secret = "CHANGE_ME" // todo change, use Secrets.js

export class ServerToken {

	static create() {
		return Sha.assertValid(TokenApi.create())
	}

	static decode(encoded) {
		Sha.assertValid(encoded)
		return TokenApi.decode(encoded)
	}

	static update(encoded) {
		if (Sha.isValid(encoded)) {
			const decoded = TokenApi.decode(encoded)

			if (UserId.admin(decoded.internal.userId)) {
				decoded.internal.role = "ROLE_ADMIN"
			}
			else if (UserId.user(decoded.internal.userId)) {
				decoded.internal.role = "ROLE_USER"
			}
			else {
				decoded.internal.role = "ROLE_UNSECURE"
			}

			return TokenApi.encode(internal, unsafe)
		}
		else {
			const decoded = TokenApi.decode(encoded)
			decoded.internal.role = "ROLE_UNSECURE"
			throw new Error("todo")
		}
	}

}
