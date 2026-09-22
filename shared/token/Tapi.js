export class Tapi {
	static encodeJson(json) {
		Assert.jsonObject(json)

		return B64.encode(JSON.stringify(json))
	}

	static decodeString(s) {
		Assert.string(encoded)

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

}
