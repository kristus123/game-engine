export class B64 {

	static encode(payload) {
		Assert.string(payload)

		const bytes = new TextEncoder().encode(payload)
		let binary = ""

		for (const byte of bytes) {
			binary += String.fromCharCode(byte)
		}

		return btoa(binary)
			.replaceAll("+", "-")
			.replaceAll("/", "_")
			.replaceAll("=", "")
	}

	static decode(encoded) {
		encoded = encoded
			.replaceAll("-", "+")
			.replaceAll("_", "/")

		while (encoded.length % 4) {
			encoded += "="
		}

		const binary = atob(encoded)
		const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))

		return new TextDecoder().decode(bytes)
	}

}
