export class LowLevelHttpClient {

	static async post({ routeName, body, formatBody, contentType } = {}) { // no-null-check

		if (Network.offline) {
			console.warn("network is offline, fetch might not work")
		}

		if (A.jsonObject(body)) {
			body = JSON.stringify(body)
			contentType = "application/json"
		}
		else if (body == null) {
			body = null
			Assert.null(contentType)
			contentType = null
		}
		else if (body instanceof Blob) {
			Assert.value(contentType)
		}
		else {
			throw new Error("current combination of body and contentType not supported")
		}

		const { ok, error, response } = await Fetch({
			url: `${Config.httpUrl}/${routeName}`,
			body: body,
			headers: {
				"Content-Type": contentType,
				"token": Token.encodedToken, // todo fix hack, turn into get and set localvalue as _encoded
			},
		})

		return {
			ok,
			error,
			body: ok ? formatBody(response) : null,
		}
	}

}
