export class Tapi {
	static encodeJson(json) { // inline later
		Assert.jsonObject(json)

		return B64.encode(JSON.stringify(json))
	}

	static decodeString(s) { // inline later
		Assert.string(s)
		return JSON.parse(B64.decode(s))
	}

	static splitEncoded(encoded) {
		Assert.string(encoded)

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

	static decode(encoded) {
		const s = this.splitEncoded(encoded)

		return {
			internal: this.decodeString(s.internal),
			internalSignature: s.internalSignature,
			unsafe: this.decodeString(s.unsafe),
		}
	}

	static combine(i, s, u) {
		return `${i}.${s}.${u}`
	}

}
