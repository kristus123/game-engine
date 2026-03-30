export const HttpClient = ProxyObject(
	(method, body = {}, callback = (body) => {}) => {

		const request = {
			body: body,
			method: "POST",
			headers: {
				"Content-Type": value instanceof Blob || value instanceof ArrayBuffer // binary
					? "application/octet-stream"
					: "application/json",
			},
		}

		fetch(`${Config.httpUrl}/${method}`, request)
			.then(r => callback(r.json()))
	}
)
