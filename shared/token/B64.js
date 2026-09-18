export class B64 {

	static encode(payload) {
		if (A.jsonObject(payload)) {
			payload = JSON.stringify(payload)
		}
		else if (A.string(payload)) {
			// ok
		}
		else {
			throw new Error("X")
		}

		const bytes = new TextEncoder().encode(JSON.stringify(payload))
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
