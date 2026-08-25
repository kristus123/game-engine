export const HttpClient = ProxyObject(
	async (routeName, { body = null, contentType, ok = body => {}, error = body => {} } = {}) => {

		if (A.jsonObject(body)) {
			Assert.null(contentType, "contentType should not be present if body is normal json object")

			return LowLevelHttpClient.post(
				routeName,
				JSON.stringify(body),
				response => response.json(),
				"application/json")
		}
		else {
			Assert.value(contentType)

			return LowLevelHttpClient.post(
				routeName,
				body,
				response => response.json(),
				contentType)
		}
	}
)
