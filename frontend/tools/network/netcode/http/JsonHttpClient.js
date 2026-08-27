export const JsonHttpClient = ProxyObject(
	async (routeName, { body, contentType, ok, error } = {}) => { // no-null-check

		return await LowLevelHttpClient.post({
			routeName: routeName,
			body: body,
			formatBody: async r => {
				try {
					return await r.json()
				}
				catch (e) {
					throw new Error(`${routeName}: response is expected to be json, but it seems to not be`)
				}
			},
			contentType: contentType ?? "application/json",
			ok: ok,
			error: error,
		})
	}
)
