export const HttpClient = ProxyObject(
	async (routeName, { body = null, contentType, ok = body => {}, error = body => {} } = {}) => {

		if (A.jsonObject(body)) {
			Assert.null(contentType, "contentType should not be present if body is normal json object")

			return await LowLevelHttpClient.post(
				routeName,
				JSON.stringify(body),
				r => r.json(),
				"application/json")
		}
		else {
			Assert.value(contentType)

			return await LowLevelHttpClient.post(
				routeName,
				body,
				r => r.json(),
				contentType)
		}
	}
)
