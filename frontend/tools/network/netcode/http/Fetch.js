export async function Fetch({ url, body, headers } = {}) {

	const abortSignal = AbortAtMs(5_000) // rename to AbortSignal or smt else

	try {
		Log(`Sending request to: ${url}`)
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
		return { ok: false, error: true, response: null, error: e }
	}
	finally {
		clearTimeout(abortSignal)
	}

}
