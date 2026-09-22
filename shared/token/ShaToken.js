Sha.secret = "SUPER_SECRET"

export class ShaToken { // rename to ValidToken ?

	static async create() {
		const encoded = InvalidToken.create()
		await Sha.assertValid(encoded)
		return encoded
	}

	static async update(encoded) {
		await Sha.assertValid(encoded)

		const decoded = InvalidToken.decode(encoded)

		if (UserId.admin(decoded.internal.userId)) {
			decoded.internal.role = "ROLE_ADMIN"
		}
		else if (UserId.user(decoded.internal.userId)) {
			decoded.internal.role = "ROLE_USER"
		}
		else {
			decoded.internal.role = "ROLE_UNSECURE"
		}

		return InvalidToken.encode(internal, unsafe)
	}


	static async decode(encoded) {
		await Sha.assertValid(encoded)

		return InvalidToken.decode(encoded)
	}

}
