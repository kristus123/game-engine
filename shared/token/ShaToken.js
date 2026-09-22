export class ShaToken { // rename to ValidToken ?

	static async create() {
		return await this.encode({
			internal: {
				userId: crypto.randomUUID(),
				role: "ROLE_UNSECURE",
			},
			unsafe: {
				username: "Your username",
				age: "Your age",
			},
		})
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

		return await this.encode(internal, unsafe)
	}

	static async decode(encoded) {
		await Sha.assertValid(encoded)

		return InvalidToken.decode(encoded)
	}

	static async decode(encoded) {
		await Sha.assertValid(encoded)

		const s = Tapi.splitEncoded(encoded)

		return {
			internal: Tapi.decodeString(s.internal),
			internalSignature: s.internalSignature,
			unsafe: Tapi.decodeString(s.unsafe),
		}
	}

	static async encode({ internal, unsafe } = {}) {
		const i = Tapi.encodeJson(internal)
		const s = await Sha.sign(i)
		const u = Tapi.encodeJson(unsafe)

		return Sha.assertValid(`${i}.${s}.${u}`)
	}

	static async updateUnsafe(encoded, decoded) {
		await Sha.assertValid(encoded)

		return this.encode({
			internal: ShaToken.decode(encoded).internal,
			unsafe: decoded.unsafe,
		})
	}

}
