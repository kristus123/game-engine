export async function Transcribe(blob) {
	const form = new FormData()

	form.append("file", blob, "audio.webm")
	form.append("model", "gpt-4o-mini-transcribe")

	form.append("language", "en")

	const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${OpenAiToken}`,
		},
		body: form,
	})

	if (!res.ok) {
		const err = await res.text()
		throw new Error("Transcription failed: " + err)
	}

	const data = await res.json()
	console.log(data.text)
	return data.text
}
