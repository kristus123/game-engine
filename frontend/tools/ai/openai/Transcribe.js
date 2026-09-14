export async function Transcribe(blob) {

	if (blob instanceof Blob && blob.type == "audio/wav") {
		// already a wav
	}
	else if (blob instanceof Blob) {
		blob = blob.toWav()
	}
	else {
		throw new Error("unsupported arg")
	}

	const form = new FormData()
	form.append("file", blob, "audio.wav")
	form.append("model", "gpt-4o-mini-transcribe")
	form.append("language", "en")

	const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${OpenAiToken}`,
		},
		body: form,
	})

	if (res.ok) {
		const data = await res.json()
		return data.text
	}
	else {
		throw new Error("Transcription failed: " + await res.text())
	}
}
