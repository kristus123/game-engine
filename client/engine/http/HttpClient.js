export const HttpClient = ProxyObject(
	(method, body = {}, callback = responseBody => {}) => {
		Assert.jsonObject(body)

		const request = {
			body: JSON.stringify(body),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		}

		return fetch(`${Config.httpUrl}/${method}`, request)
			.then(r => r.json())
			.then(json => {
				return callback(Assert.jsonObject(json))
			})
			.catch(e => {
				throw new Error(e)
			})
	}
)
