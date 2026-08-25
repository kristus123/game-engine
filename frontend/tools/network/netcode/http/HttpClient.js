export const HttpClient = ProxyObject(
	(routeName, { body = {}, contentType="application/json", rawBody = null, ok = body => {}, error = body => {} } = {}) => {
		// todo fix default contentType
		Assert.jsonObject(body)
		Assert.value(contentType)
		console.log(contentType)

		const abortController = new AbortController()
		const timer = setTimeout(() => {
			abortController.abort()
		}, 3_000)

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

		Log(`
			Sending request to: ${routeName}
		`.dedent())
		return fetch(`${Config.httpUrl}/${routeName}`, request)
			.then(async response => {
				const responseBody = await response.json()

				Assert.jsonObject(responseBody)

				if (response.ok) {
					ok(responseBody)

					Log(`
						OK

						${responseBody}
					`.dedent())

					return {
						ok: true,
						error: false,
						body: responseBody,
					}
				}
				else {
					error(responseBody)

					Log(`
						ERROR 1

						${responseBody}
					`.dedent())


					return {
						ok: false,
						error: true,
						body: responseBody,
					}
				}
			})
			.catch(e => {
				Log(`
					ERROR 2

					${e}

					${e.stack}
				`.dedent())

				console.error(e)

				return {
					ok: false,
					error: true,
					body: { msg: "todo get body" },
				}
			})
			.finally(() => {
				clearTimeout(timer)
			})
	}
)
