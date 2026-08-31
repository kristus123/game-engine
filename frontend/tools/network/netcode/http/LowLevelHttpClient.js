export class LowLevelHttpClient {

	static async post({ routeName, body, formatBody, contentType } = {}) { // no-null-check

		if (A.jsonObject(body)) {
			body = JSON.stringify(body)
			contentType = "application/json"
		}
		else if (body == null) {
			body = null
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
				"token": ClientToken.encodedToken ?? null,
			},
		})

		if (ok) {
			return { ok, error, body: formatBody(response) }
		}
		else {
			return { ok, error, body: null }
		}
	}

}
