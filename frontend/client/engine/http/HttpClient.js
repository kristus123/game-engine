export const HttpClient = ProxyObject(
	(method, params = { body: {}, ok: body => {}, error: body => {} }) => {
		Assert.jsonObject(params.body)

		const abortController = new AbortController()
		const timer = setTimeout(() => {
			abortController.abort()
		}, 1_000)

		const request = {
			body: JSON.stringify(params.body),
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
				const body = await response.json()

				Assert.jsonObject(body)

				if (response.ok) {
					params.ok(body)

					return {
						ok: true,
						error: null,
						body: body
					}
				}
				else {
					params.error(body)

					return {
						ok: false,
						error: body,
						body: null

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
