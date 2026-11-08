export const NullHttpClient = ProxyObject(
	async (routeName, { body, contentType, ok, error } = {}) => { // allow-null

		return await LowLevelHttpClient.post({
			routeName: routeName,
			body: body,
			formatBody: async r => {
				const t = await r.text()
				if t == "" {
					return null
				}
				else {
					throw new Error(`${routeName} is expected to return null, but returned: ${t}`)
				}
			},
			contentType: contentType,
			ok: ok,
			error: error,
		})
	}
)
