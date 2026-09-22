export function HttpBody(req) {
	const contentType = ContentType.parse(req.headers["content-type"])

	if (contentType == null) {
		return null
	}
	else if (contentType.name == ContentType.json) {
		return await Poop.parseJsonBody(req)
	}
	else if (contentType.name == ContentType.webm) {
		return null
	}
	else {
		throw new Error("unsupported contentType")
	}
}
