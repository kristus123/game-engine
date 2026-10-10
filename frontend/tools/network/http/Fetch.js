// this method is quite coupled to our local server. maybe fix in the future

export async function Fetch({ url, body, headers, timeoutMs = 8_000, method = "POST" } = {}) { // no-null-check
	Assert.value(url)
	Assert.value(headers)

	try {
		return await Retry(3, async () => {
			console.log(`Sending request to: ${url}`)

			ChaosMonkey.maybeCrash({
				feature: "NETWORK_FETCH",
				message: "network fetch",
			})

			await ChaosMonkey.delay({ feature: "NETWORK_FETCH" })
			const r = await fetch(url, {
				body: body,
				method: method,
				cache: "no-store",
				signal: AbortSignal.timeout(timeoutMs),
				headers: headers,
			})

			Assert.true(r.status == 200 || r.status == 500, "only allow http status 200 or 500")

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
