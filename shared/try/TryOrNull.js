export function TryOrNull(callback) {
	try {
		return callback()
	}
	catch (e) {
		console.log(e)
		return null
	}
}
