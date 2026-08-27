export class LowLevelHttpClient {
	static async post({ routeName, body = "none", formatBody, contentType, ok = () => {}, error = () => {} } = {}) {

		if (A.jsonObject(body)) {
			body = JSON.stringify(body)
		}
		else if (body == "none") {
			body = null
		}
		else if (body instanceof Blob) {
			// good
		}
		else {
			console.log(typeof body)
			throw new Error("Currently we only support sending json and null to backend")
		}

		const timer = AbortAtMs(3_000) // rename to AbortSignal or smt else

		try {
			Log(`Sending request to: ${routeName}`)

			const response = await fetch(`${Config.httpUrl}/${routeName}`, {
				body: body,
				method: "POST",
				cache: "no-store",
				signal: timer,
				headers: {
					"Content-Type": Assert.value(contentType),
					"token": ClientToken.encodedToken ?? null,
				},
			})

			const responseBody = await formatBody(response)

			if (response.ok) {
				Log("OK")
				ok?.(responseBody)
				return { ok: true, error: false, body: responseBody }
			}
			else {
				Log("ERROR")
				error?.(responseBody)
				return { ok: false, error: true, body: responseBody }
			}
		}
		catch (e) {
			Log("ERROR", e)
			console.error(e)
			return { ok: false, error: true }
		}
		finally {
			clearTimeout(timer)
		}
	}

}
