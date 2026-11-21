function setState(html, state, message) {
	html.fields.status = state
	html.fields.shell.classList.toggle("is-recording", state != "idle")
	html.toggleRecording.disabled = state == "processing"
	html.toggleRecording.textContent = state == "recording" ? "Stop" : state == "processing" ? "Translating…" : "Start recording"
	html.toggleRecording.classList.toggle("is-listening", state == "recording")
	html.translationStatus.textContent = message
}

function clearResult(html) {
	globalThis.speechSynthesis?.cancel()
	html.translationResult.hidden = true
	html.sourceText.textContent = ""
	html.translatedText.textContent = ""
	html.detectedLanguages.textContent = ""
	html.detectedLanguages.hidden = true
	html.fields.targetLanguage = null
}

const languageNames = { en: "English", ja: "Japanese" }

function normalizeLanguage(code) {
	const base = code.toLowerCase().split("-")[0]
	return ({ eng: "en", jpn: "ja" })[base] || base
}

function stopTracks(stream) {
	stream?.getTracks().forEach(track => track.stop())
}

async function startRecording(html) {
	const request = ++html.fields.request
	clearResult(html)
	html.translationResult.hidden = false
	try {
		// Capture and playback are separate. Avoid Android's voice-call processing
		// and the audio routing changes it can introduce before TTS playback.
		const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
		if request != html.fields.request {
			stopTracks(stream)
			return
		}
		const mimeType = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"].find(type => MediaRecorder.isTypeSupported(type))
		const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
		const chunks = []
		html.fields.stream = stream
		html.fields.recorder = recorder
		recorder.ondataavailable = event => {
			if event.data.size > 0 {
				chunks.push(event.data)
			}
		}
		recorder.onerror = () => {
			if request == html.fields.request {
				html.fields.request++
				stopTracks(stream)
				html.fields.stream = null
				html.fields.recorder = null
				setState(html, "idle", "Recording failed. Please try again.")
			}
		}
		recorder.onstop = () => {
			stopTracks(stream)
			html.fields.stream = null
			html.fields.recorder = null
			if request == html.fields.request {
				processRecording(html, request, new Blob(chunks, { type: recorder.mimeType }))
			}
		}
		recorder.start()
		setState(html, "recording", "Recording… Press stop when you’re done.")
	}
	catch (error) {
		if request == html.fields.request {
			setState(html, "idle", error.name == "NotAllowedError" ? "Microphone access was denied. Allow it in your browser and try again." : error.message)
		}
	}
}

async function processRecording(html, request, blob) {
	const controller = new AbortController()
	html.fields.controller = controller
	setState(html, "processing", "Transcribing your recording…")
	try {
		const transcription = await Transcribe(blob, { signal: controller.signal, includeMetadata: true })
		if request != html.fields.request {
			return
		}
		const source = transcription.text
		if !source {
			throw new Error("No speech was detected. Try recording again.")
		}
		const detectedCodes = transcription.languages.map(language => language.code).filter(code => typeof code == "string")
		const detectedSource = detectedCodes.map(normalizeLanguage).find(code => code == "en" || code == "ja")
		if !detectedSource {
			throw new Error("I couldn't detect English or Japanese. Please try again and speak clearly in English or Japanese.")
		}
		const actualDirection = { source: detectedSource, target: detectedSource == "en" ? "ja" : "en" }
		html.fields.targetLanguage = actualDirection.target
		html.sourceHeading.textContent = languageNames[actualDirection.source]
		html.targetHeading.textContent = languageNames[actualDirection.target]
		html.detectedLanguages.textContent = detectedCodes.length
			? `Detected by gpt-transcribe: ${detectedCodes.map(code => `${languageNames[normalizeLanguage(code)] || code} (${code})`).join(", ")}`
			: "Detected by gpt-transcribe: no reliable language result"
		html.detectedLanguages.hidden = false
		html.sourceText.textContent = source
		html.translationResult.hidden = false
		setState(html, "processing", "Translating…")
		const translated = await TranslateText(source, actualDirection.source, actualDirection.target, { signal: controller.signal })
		if request != html.fields.request {
			return
		}
		html.translatedText.textContent = translated
		setState(html, "idle", "Playing translation…")
		try {
			await Tts(translated, { language: actualDirection.target })
			if request == html.fields.request {
				html.translationStatus.textContent = ""
			}
		}
		catch (error) {
			if request == html.fields.request {
				setState(html, "idle", `Translation is ready, but speech playback failed: ${error.message}`)
			}
		}
	}
	catch (error) {
		if request == html.fields.request {
			setState(html, "idle", error.name == "AbortError" ? "Translation cancelled." : error.message)
		}
	}
	finally {
		if html.fields.controller == controller {
			html.fields.controller = null
		}
	}
}

function stopRecording(html) {
	if html.fields.recorder?.state == "recording" {
		setState(html, "processing", "Preparing your recording…")
		html.fields.recorder.stop()
		stopTracks(html.fields.stream)
		html.fields.stream = null
	}
}

export default {
	page: { persistOnClose: true },
	fields: () => ({ status: "idle", request: 0, shell: null, recorder: null, stream: null, controller: null, targetLanguage: null }),
	onFirstDomAdd: ({ html }) => {
		html.fields.shell = html.querySelector(".translate-shell")
		html.toggleRecording.addEventListener("click", () => {
			if html.fields.status == "idle" {
				return startRecording(html)
			}
			if html.fields.status == "recording" {
				stopRecording(html)
			}
		})
		setState(html, "idle", "Ready. Speak English or Japanese.")
	},
	onDomRemove: ({ html }) => {
		html.fields.request++
		html.fields.controller?.abort()
		html.fields.recorder?.stop()
		stopTracks(html.fields.stream)
		html.fields.recorder = null
		html.fields.stream = null
	},
}
