const activeTranscriptions = new Set()

UnsecureRoute.transcribeAudio = async ({ req, res, params, userId }) => {
	if activeTranscriptions.has(userId) || activeTranscriptions.size >= 2 {
		throw new Error("Transcription is busy. Please try again shortly.")
	}
	activeTranscriptions.add(userId)
	const controller = new AbortController()
	const cancel = () => controller.abort()
	req.once("aborted", cancel)
	res.once("close", cancel)
	try {
		const chunks = []
		let size = 0
		for await const chunk of req {
			size += chunk.length
			if size > 25 * 1024 * 1024 {
				throw new Error("Recorded audio exceeds the 25 MB transcription limit")
			}
			chunks.push(chunk)
		}
		if controller.signal.aborted {
			throw new Error("Transcription cancelled")
		}
		const blob = new Blob(chunks, { type: params.type || "" })
		const text = await TranscribeAudio(blob, { signal: controller.signal })
		return { text }
	}
	finally {
		activeTranscriptions.delete(userId)
		req.removeListener("aborted", cancel)
		res.removeListener("close", cancel)
	}
}
