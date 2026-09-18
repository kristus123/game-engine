export class TokenApi {

	static decode(encodedToken) {
		const [
			internal,
			internalSignature,
			unsafe,
		] = encodedToken.split(".")

		return {
			internal: JSON.parse(B64.decode(internal)),
			internalSignature: internalSignature,
			unsafe: JSON.parse(B64.decode(unsafe)),
		}

	}

}
