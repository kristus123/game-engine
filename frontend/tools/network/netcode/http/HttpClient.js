export const HttpClient = ProxyObject(
	(routeName, { body = {}, contentType="application/json", rawBody = null, ok = body => {}, error = body => {} } = {}) => {
		// todo fix default contentType
		Assert.jsonObject(body)
		Assert.value(contentType)
		console.log(contentType)

		const abortController = new AbortController()
		const timer = setTimeout(() => {
			abortController.abort()
		}, 1_000)

		const request = {
			body: rawBody ?? JSON.stringify(body),
			method: "POST",
			cache: "no-store", // disables cache
			signal: abortController.signal,
			headers: {
				"Content-Type": contentType,
				"token": ClientToken.encodedToken ?? null,
			},
		}

		return fetch(`${Config.httpUrl}/${routeName}`, request)
			.then(async response => {
				const json = await response.json()

				Assert.jsonObject(json)

				if (response.ok) {
					ok(json)

					return {
						ok: true,
						error: false,
						body: json,
					}
				}
				else {
					error(json)

					return {
						ok: false,
						error: true,
						body: json,
					}
				}
			})
			.catch(e => {
				console.log("happy.")
				console.error(`${routeName}: ${e?.message}`)
				error({ error: e })
				return {
					ok: false,
					error: true,
					body: json,
				}
			})
			.finally(() => {
				clearTimeout(timer)
			})
	}
)
