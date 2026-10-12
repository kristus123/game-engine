export class LowLevelHttpClient {
	static async get(options = {}) {
		return this._call("GET", options)
	}

	static async post(options = {}) {
		return this._call("POST", options)
	}

	static async _call(method, { routeName, body, formatBody, contentType, timeoutMs = 8_000 } = {}) { // no-null-check
		Assert.either(method, ["GET", "POST"])

		try {
			if Network.offline {
				console.warn("network is offline, fetch might not work")
			}

			const headers = {
				"token": Token.encodedToken, // token is allowed to be null
			}

			switch method {
				case "GET" {
					body = null
				}
				case "POST" {
					if A.jsonObject(body) {
						body = JSON.stringify(body)
						contentType = "application/json"
					}
					else if body == null {
						body = null
						Assert.null(contentType)
						contentType = null
					}
					else if body instanceof Blob {
						Assert.value(contentType)
					}
					else {
						throw new Error("current combination of body and contentType not supported")
					}
					headers["Content-Type"] = contentType
				}
			}

			const { httpStatusCode, response } = await Fetch({
				url: `${Config.httpUrl}/${routeName}`,
				body: body,
				method: method,
				timeoutMs: timeoutMs,
				headers: headers,
			})

			Assert.true(httpStatusCode == 200 || httpStatusCode == 500, "only allow http status 200 or 500")
			const ok = httpStatusCode == 200
			return {
				ok: ok,
				error: !ok,
				body: ok ? await formatBody(response) : null,
			}
		}
		catch (e) {
			console.log(`error while sending request to ${Config.httpUrl}/${routeName}`)
			console.error(e)
			return {
				ok: false,
				error: e,
				body: null,
			}
		}
	}

}
