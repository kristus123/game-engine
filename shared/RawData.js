export class RawData {
	static type(value) {
		if (typeof Buffer != "undefined" && Buffer.isBuffer(value)) {
			return "Buffer"
		}
		else if (value instanceof Uint8Array) {
			return "Uint8Array"
		}
		else if (value instanceof ArrayBuffer) {
			return "ArrayBuffer"
		}
		else if (value instanceof DataView) {
			return "DataView"
		}
		else if (value instanceof Blob) {
			return "Blob"
		}
		else if (value instanceof File) {
			return "File"
		}
		else if (value instanceof ReadableStream) {
			return "ReadableStream"
		}
		else if (value instanceof WritableStream) {
			return "WritableStream"
		}
		else if (value instanceof TransformStream) {
			return "TransformStream"
		}
		else if (value instanceof Request) {
			return "Request"
		}
		else if (value instanceof Response) {
			return "Response"
		}
		else {
			throw new TypeError("Value is not raw data")
		}
	}
}
