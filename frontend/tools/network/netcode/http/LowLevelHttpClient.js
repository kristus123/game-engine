export class LowLevelHttpClient {
	static async post(routeName, body, formatBody, contentType, { ok=() => {}, error=() => {} } = {}) {

		const timer = AbortAtMs(3_000) // rename to AbortSignal or smt else

		try {
			Log(`Sending request to: ${routeName}`)

			const response = await fetch(`${Config.httpUrl}/${routeName}`, {
				body: body,
				method: "POST",
				cache: "no-store",
				signal: timer,
				headers: {
					"Content-Type": contentType,
					"token": ClientToken.encodedToken ?? null,
				},
			})

			const text = await response.text()
			const data = text ? JSON.parse(text) : null

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
