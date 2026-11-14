export async function TranslateSpokenTurn(blob, languages, signal) {
	const text = await Transcribe(blob, { signal })
	if !text {
		return null
	}
	const response = await fetch(`${Config.httpUrl}/translateConversationTurn`, {
		method: "POST",
		headers: { "Content-Type": "application/json", token: Token.encodedToken ?? "null" },
		body: JSON.stringify({ text, languages }),
		signal: AbortSignal.any([signal, AbortSignal.timeout(70_000)]),
	})
	if !response.ok {
		const error = await response.json().catch(() => ({}))
		throw new Error(error.error || "Could not translate the spoken phrase")
	}
	return await response.json()
}
