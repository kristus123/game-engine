export async function TranslateText(text, source, target, { signal } = {}) { // allow-null
	const response = await fetch(`${Config.httpUrl}/translateText`, {
		method: "POST",
		headers: { "Content-Type": "application/json", token: Token.encodedToken ?? "null" },
		body: JSON.stringify({ text, source, target }),
		signal: AbortSignal.any([AbortSignal.timeout(35_000), ...(signal ? [signal] : [])]),
	})
	if !response.ok {
		const error = await response.json().catch(() => ({}))
		throw new Error(error.error || "Could not translate the recording")
	}
	const data = await response.json()
	if typeof data.translation != "string" {
		throw new Error("The translation response contained no text")
	}
	return data.translation
}
