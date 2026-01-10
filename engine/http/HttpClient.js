export const HttpClient = ProxyObject(
	{}, (method, body = {}, callback = (body) => {}) => {
		const promise = fetch(`${Config.baseUrl}/${method}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				body: body
			})
		}).then(r => r.json())

		promise.then(callback)
	})

