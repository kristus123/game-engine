export async function Transcribe(blob, { signal } = {}) { // allow-null
	blob = await blob
	if !(blob instanceof Blob) || blob.size == 0 {
		throw new Error("No recorded audio to transcribe")
	}
	if blob.size > 25 * 1024 * 1024 {
		throw new Error("Recorded audio exceeds the 25 MB transcription limit")
	}

	const response = await fetch(`${Config.httpUrl}/transcribeAudio?type=${encodeURIComponent(blob.type)}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/octet-stream",
			token: Token.encodedToken ?? "null",
		},
		body: blob,
		signal: AbortSignal.any([AbortSignal.timeout(40_000), ...(signal ? [signal] : [])]),
	})
	if !response.ok {
		throw new Error("Could not transcribe the recording. Please try again.")
	}
	const data = await response.json()
	if typeof data.text != "string" {
		throw new Error("The transcription response contained no text")
	}
	return data.text.trim()
}
