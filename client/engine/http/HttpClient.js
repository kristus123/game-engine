// ClientId(

export const HttpClient = ProxyObject(
	{}, (method, body = {}, callback = (body) => {}) => {
		const request = buildRequest(body)
		const promise = fetch(`${Config.httpUrl}/${method}`, request).then(r => r.json())

		promise.then(callback)
	})

function buildRequest(body) {
	if (isBinary(body)) {
		return {
			method: "POST",
			headers: {
				"Content-Type": "application/octet-stream",
				"X-Client-Id": ClientId
			},
			body
		}
	}

	return {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Client-Id": ClientId
		},
		body: JSON.stringify(body ?? {})
	}
}

function isBinary(value) {
	return value instanceof Blob || value instanceof ArrayBuffer
}

