// ClientId(

export const HttpClient = ProxyObject(
	{}, (method, body = {}, callback = (body) => {}, params = null) => {
		let url = `${Config.httpUrl}/${method}`

		if (params && typeof params === 'object') {
			const qs = new URLSearchParams(params).toString()
			if (qs.length > 0) {
				url += `?${qs}`
			}
		}

		const request = buildRequest(body)
		fetch(url, request).then(r => r.json()).then(callback)
	})

function buildRequest(body) {
	if (isBinary(body)) {
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/octet-stream',
			},
			body
		}
	}

	return {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body ?? {})
	}
}

function isBinary(value) {
	return value instanceof Blob || value instanceof ArrayBuffer
}

