export const NullHttpClient = ProxyObject(
	async (routeName, { body, contentType, ok, error } = {}) => { // no-null-check

		return await LowLevelHttpClient.post({
			routeName: routeName,
			body: body,
			formatBody: async r => {
				const t =  await r.text()
				if t == "" {
					return null
				}
				else {
					throw new Error(`${routeName} is expected to return null, but returned: ${t}`)
				}
			},
			contentType: contentType ?? "application/json",
			ok: ok,
			error: error,
		})
	}
)
