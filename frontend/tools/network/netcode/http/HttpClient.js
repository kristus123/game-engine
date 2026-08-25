export const HttpClient = ProxyObject(
	async (routeName, { body = {}, contentType = "application/json", rawBody = null, ok = body => {}, error = body => {} } = {}) => {
		Assert.jsonObject(body)
		Assert.value(contentType)
		console.log(contentType)

		const timer = AbortAtMs(3_000) // rename to AbortSignal or smt else

		const request = {
			body: rawBody ?? JSON.stringify(body),
			method: "POST",
			cache: "no-store",
			signal: timer, headers: {
				"Content-Type": contentType,
				"token": ClientToken.encodedToken ?? null,
			},
		}

		try {
			Log(`Sending request to: ${routeName}`)

			const response = await fetch(`${Config.httpUrl}/${routeName}`, request)
			const responseBody = await response.json()

			Assert.jsonObject(responseBody)

			if (response.ok) {
				ok(responseBody)

				Log("ok")
				Log(responseBody)

				return {
					ok: true,
					error: false,
					body: responseBody,
				}
			}

			error(responseBody)

			Log(`
				ERROR 1

				${responseBody}
			`.dedent())

			return {
				ok: false,
				error: true,
				body: responseBody,
			}
		}
		catch (e) {
			Log(`
				ERROR 2

				${e}

				\`\`\`
				${e.stack}
				\`\`\`
			`.dedent())

			console.error(e)

			return {
				ok: false,
				error: true,
				body: { msg: "todo get body" },
			}
		}
		finally {
			clearTimeout(timer)
		}
	}
)
