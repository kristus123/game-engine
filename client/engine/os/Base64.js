export class Base64 {

	static encode(blob) {
		const reader = new FileReaderSync()
		return reader.readAsDataURL(blob)
	}

	static decode(str) {
		const binary = atob(str)
		const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
		return new TextDecoder().decode(bytes)
	}

}
