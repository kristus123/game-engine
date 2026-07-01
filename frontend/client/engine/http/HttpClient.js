export const HttpClient = ProxyObject(
	(method, { body = {}, ok = body => {}, error = body => {} } = {}) => {
		Assert.jsonObject(body)

		const abortController = new AbortController()
		const timer = setTimeout(() => {
			abortController.abort()
		}, 1_000)

		const request = {
			body: JSON.stringify(body),
			method: "POST",
			cache: "no-store", // disables cache
			signal: abortController.signal,
			headers: {
				"Content-Type": "application/json",
				"token": ClientToken.encodedToken ?? null,
			},
		}

		return fetch(`${Config.httpUrl}/${method}`, request)
			.then(async response => {
				const json = await response.json()

				Assert.jsonObject(json)

				if (response.ok) {
					ok(json)

					return {
						ok: true,
						error: false,
						body: json
					}
				}
				else {
					error(json)

					return {
						ok: false,
						error: true,
						body: json
					}
				}
			})
			.catch(e => {
				console.error(`${method}: ${e?.message}`)
				throw e
			})
			.finally(() => {
				clearTimeout(timer)
			})
	}
)


// in the future
// maybe do something like this
/*
httpClient.getStuff({
	body: {},
	ok: body => {

	},
	error: e => {

	},
})
*/

/*
 * and also support this
const {ok, error} = await httpClient.getStuff({body: {}})
*/
