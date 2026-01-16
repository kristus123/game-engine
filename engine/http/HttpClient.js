export const HttpClient = ProxyObject(
	{}, (method, body = {}, callback = (body) => {}) => {
		const request = buildRequest(body)
		const promise = fetch(`${Config.httpUrl}/${method}`, request).then(r => r.json())

		promise.then(callback)
	})
	
function buildRequest(body) {
	if (isBinary(body)) {
		return {
			method: 'POST',
			headers: {
				'Content-Type': body.type || 'application/octet-stream'
			},
			body
		}
	}

	return {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body ?? {})
	}
}

function isBinary(value) {
	return value instanceof Blob || value instanceof ArrayBuffer
}

