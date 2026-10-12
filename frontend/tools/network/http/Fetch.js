export async function Fetch({ url, body, headers, timeoutMs = 8_000, method } = {}) { // no-null-check
	Assert.value(url)
	Assert.value(headers)
	Assert.string(method)

	return await Retry(3, async () => {
		console.log(`Sending request to: ${url}`)

		ChaosMonkey.maybeCrash({
			feature: "NETWORK_FETCH",
			message: "network fetch",
		})

		await ChaosMonkey.delay({ feature: "NETWORK_FETCH" })
		const response = await fetch(url, {
			body: body,
			method: method,
			cache: "no-store",
			signal: AbortSignal.timeout(timeoutMs),
			headers: headers,
		})

		return {
			httpStatusCode: response.status,
			response: response,
		}
	})
}
