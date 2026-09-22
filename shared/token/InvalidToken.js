export class InvalidToken {

	static create() {
		return this.encode({
			internal: {
				userId: randomUUID(),
				role: "ROLE_UNSECURE",
			},
			unsafe: {
				username: "Your username",
				age: "Your age",
			},
		})
    	}

	static decode(encoded) {
		Assert.string(encoded)

		const s = this.splitEncoded(encoded)

		return {
			internal: JSON.parse(B64.decode(s.internal)),
			internalSignature: s.internalSignature,
			unsafe: JSON.parse(B64.decode(s.unsafe)),
		}
	}

	static encode({ internal, unsafe } = {}) {
		Assert.jsonObject(internal)
		Assert.jsonObject(unsafe)

		const i = B64.encode(JSON.stringify(internal))
		const u = B64.encode(JSON.stringify(unsafe))

		return `${i}.INVALID_SIGNATURE.${u}`
	}

	static splitEncoded(encoded) {
		const [
			internal,
			internalSignature,
			unsafe,
		] = encoded.split(".")

		return {
			internal,
			internalSignature,
			unsafe,
		}
	}

	static updateUnsafe(encoded, decoded) {
		const { internal } = ShaToken.splitEncoded(encoded)

		const unsafe = B64.encode(JSON.stringify(decoded.unsafe))
		return this.encode({ internal, unsafe })
	}

}
