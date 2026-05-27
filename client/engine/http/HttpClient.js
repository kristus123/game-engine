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
				console.log("____________________________")
				console.log(Assert.jsonObject(json))
				console.log(JSON.stringify(json))
				return callback(Assert.jsonObject(json))
			})
			.catch(e => {
				console.log(`Error while calling ${method}`)
				console.log(e)
				console.log("____________________________")
			})
	}
)
