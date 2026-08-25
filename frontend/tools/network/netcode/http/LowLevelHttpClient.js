export class LowLevelHttpClient {
	static post(routeName, body, formatBody, contentType) {

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
			
			const responseBody = await formatBody(response)

			if (response.ok) {
				ok(responseBody)
				return { ok: true, error: false, body: responseBody, }
			}
			else {
				error(responseBody)
				return { ok: false, error: true, body: responseBody, }
			}
		}
		catch (e) {
			console.error(e)
			return { ok: false, error: true }
		}
		finally {
			clearTimeout(timer)
		}
	}
	
}
