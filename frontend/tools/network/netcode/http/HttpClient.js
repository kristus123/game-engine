export const HttpClient = ProxyObject(
	async (routeName, { body = null, contentType, ok = body => {}, error = body => {} } = {}) => {

		if (A.jsonObject(body)) {
			Assert.null(contentType, "contentType should not be present if body is normal json object")

			return await LowLevelHttpClient.post(
				routeName,
				JSON.stringify(body),
				response => response.json(),
				"application/json")
		}
		else {
			console.log(routeName)
			console.log("2")
			// Assert.value(contentType)

			return await LowLevelHttpClient.post(
				routeName,
				body,
				response => response.json(),
				contentType)
		}
	}
)
