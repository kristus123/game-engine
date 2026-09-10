// this method is quite coupled to our local server. maybe fix in the future

export async function Fetch({ url, body, headers } = {}) { // no-null-check
	Assert.value(url)
	Assert.value(headers)

	const abortSignal = AbortAtMs(80_000) // rename to AbortSignal or smt else

	try {
		console.log(`Sending request to: ${url}`)
		const r = await fetch(url, {
			body: body,
			method: "POST",
			cache: "no-store",
			signal: abortSignal,
			headers: headers,
		})

		const ok = r.status == 200

		return { ok: ok, error: !ok, response: r }
	}
	catch (e) {
		console.log("error while sending request to " + url)
		console.log(e)
		console.error(e.stack)
		return { ok: false, error: true, response: null, error: e }
	}
	finally {
		clearTimeout(abortSignal)
	}

}
