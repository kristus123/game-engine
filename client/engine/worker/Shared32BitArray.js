function Shared32BitArray(length) {

	const buffer = new SharedArrayBuffer(length * 4)
	const shared = new Int32Array(buffer)

	return buffer
}
