import { Secrets } from "#root/Secrets.js"

export async function TranscribeAudio(blob, { signal } = {}) { // allow-null
	blob = await blob
	if !(blob instanceof Blob) || blob.size == 0 {
		throw new Error("No recorded audio to transcribe")
	}
	if blob.size > 25 * 1024 * 1024 {
		throw new Error("Recorded audio exceeds the 25 MB transcription limit")
	}

	const extensions = {
		"audio/webm": "webm", "video/webm": "webm",
		"audio/mp4": "mp4", "video/mp4": "mp4", "audio/x-m4a": "m4a",
		"audio/ogg": "ogg", "audio/wav": "wav", "audio/x-wav": "wav",
		"audio/mpeg": "mp3", "audio/mp3": "mp3", "audio/flac": "flac",
	}
	const extension = extensions[blob.type.split(";")[0]]
	if !extension {
		throw new Error(`Unsupported audio format: ${blob.type}`)
	}
	const form = new FormData()
	form.append("file", blob, `recording.${extension}`)
	form.append("model", "gpt-4o-mini-transcribe")

	const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${Secrets.openAiToken}`,
		},
		body: form,
		signal: AbortSignal.any([AbortSignal.timeout(30_000), ...(signal ? [signal] : [])]),
	})

	if !res.ok {
		throw new Error(`Transcription failed (HTTP ${res.status})`)
	}
	const data = await res.json()
	if typeof data.text != "string" {
		throw new Error("The transcription response contained no text")
	}
	return data.text.trim()
}
