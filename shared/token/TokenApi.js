export class TokenApi {

	static decode(encoded) {
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

		return Sha.assertValid(`${i}.${Sha.sign(i)}.${u}`)
	}

	static splitEncoded(e) {
		const [
			internal,
			internalSignature,
			unsafe,
		] = e.split(".")

		return {
			internal,
			internalSignature,
			unsafe,
		}
	}

	static updateUnsafe(encoded, decoded) {
		const { internal } = TokenApi.splitEncoded(encoded)

		const unsafe = B64.encode(JSON.stringify(decoded.unsafe))
		this.encoded.value = this.encode({ internal, unsafe })
	}

}
