export async function RecordAudio({ signal, onError = () => {} } = {}) { // allow-null
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
	const release = () => stream.getTracks().forEach(track => track.stop())
	if signal?.aborted {
		release()
		throw new DOMException("Recording cancelled", "AbortError")
	}

	let recorder
	try {
		const mimeType = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"].find(type => MediaRecorder.isTypeSupported(type))
		recorder = new MediaRecorder(stream, mimeType ? { mimeType, audioBitsPerSecond: 64_000 } : {})
	}
	catch (error) {
		release()
		throw error
	}

	const chunks = []
	let cancelled = false
	let resolveResult
	let rejectResult
	const result = new Promise((resolve, reject) => {
		resolveResult = resolve
		rejectResult = reject
	})
	// A device can fail before the caller presses Stop.
	result.catch(() => {})

	const cancel = () => {
		cancelled = true
		if recorder.state != "inactive" {
			recorder.stop()
		}
		release()
		rejectResult(new DOMException("Recording cancelled", "AbortError"))
	}
	const cleanup = () => {
		signal?.removeEventListener("abort", cancel)
		release()
	}
	recorder.ondataavailable = event => {
		if event.data.size > 0 {
			chunks.push(event.data)
		}
	}
	recorder.onstop = () => {
		cleanup()
		if !cancelled {
			resolveResult(new Blob(chunks, { type: recorder.mimeType }))
		}
	}
	recorder.onerror = event => {
		const error = event.error ?? new Error("Microphone recording failed")
		cancel()
		cleanup()
		onError(error)
	}
	signal?.addEventListener("abort", cancel, { once: true })
	try {
		recorder.start()
	}
	catch (error) {
		cleanup()
		throw error
	}

	return {
		stop: () => {
			if recorder.state != "inactive" {
				recorder.stop()
			}
			return result
		},
		cancel,
	}
}
