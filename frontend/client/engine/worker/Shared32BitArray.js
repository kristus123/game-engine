// | Int8Array    | 1 byte   |
// | Int16Array   | 2 bytes  |
// | Int32Array   | 4 bytes  |
// | Float32Array | 4 bytes  |
// | Float64Array | 8 bytes  |

function Shared32BitArray(length) {

	const buffer = new SharedArrayBuffer(length * 4)
	const shared = new Int32Array(buffer)

	return buffer
}
