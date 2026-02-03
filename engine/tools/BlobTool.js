export class BlobTool {
    static {}
	static blobify(raw) {
		const byteArray = new Uint8Array(raw.data)
		return new Blob([byteArray], { type: 'audio/webm' })
	}
}