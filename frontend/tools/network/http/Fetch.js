// this method is quite coupled to our local server. maybe fix in the future

export async function Fetch({ url, body, headers } = {}) {
	Assert.value(url)
	Assert.value(headers)

	try {
		return await Retry(3, async () => {
			console.log(`Sending request to: ${url}`)

			ChaosMonkey.maybeCrash(0.1, "network fetch")

			const r = await fetch(url, {
				body: body,
				method: "POST",
				cache: "no-store",
				signal: AbortSignal.timeout(8_000),
				headers: headers,
			})

			Assert.true(r.status == 200 || r.status == 500, "only allow http status 200 or 500)

			const ok = r.status == 200

			return {
				ok: ok,
				error: !ok,
				response: r,
				error: null,
			}
		})
	}
	catch (e) {
		console.log("error while sending request to " + url)
		console.log(e)
		console.error(e.stack)

		return {
			ok: false,
			error: true,
			response: null,
			error: e,
		}
	}
}
