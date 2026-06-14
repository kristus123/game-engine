// This class should be able to encode both strings and blobs. So we should probably do something more like this. Make it very explicit exactly what we are encoding.
// encodeString, encodeBlog
// Right now it it's only working on strings, but in the future it should support blobs as well.

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
