const conversationLanguages = { en: "English", zh: "Chinese · 中文", ja: "Japanese · 日本語" }

function updateConversationStart(html) {
	const same = html.firstLanguage.value == html.secondLanguage.value
	const { running, mode, recording } = html.fields
	const conversationActive = running && mode == "conversation"
	html.startConversation.disabled = (same && !conversationActive) || recording
	html.startConversation.textContent = conversationActive ? "End session" : "Start conversation"
	html.startConversation.classList.toggle("is-listening", conversationActive)
	html.startRecording.disabled = same || (running && mode != "manual")
	html.startRecording.textContent = recording ? (html.fields.manualReady ? "Stop recording" : "Cancel connection") : "Start recording"
	html.startRecording.classList.toggle("is-listening", recording)
	if same {
		html.translationStatus.textContent = "Choose different languages"
	}
	else if !running {
		html.translationStatus.textContent = "Microphone off"
	}
}

function stopManualTranslationRecording(html) {
	if html.fields.mode != "manual" || !html.fields.recording {
		return
	}
	if !html.fields.manualReady {
		stopConversationTranslation(html)
		return
	}
	html.fields.conversation.stopRecording()
	html.fields.recording = false
	updateConversationStart(html)
	html.translationStatus.textContent = "Microphone off · Translating…"
}

function stopConversationTranslation(html) {
	html.fields.request++
	html.fields.running = false
	html.fields.mode = null
	html.fields.recording = false
	html.fields.manualReady = false
	html.fields.conversation.stop()
	html.firstLanguage.disabled = false
	html.secondLanguage.disabled = false
	html.enableTranslationAudio.hidden = true
	updateConversationStart(html)
	html.translationStatus.textContent = "Microphone off"
}

async function startConversationTranslation(html, manual = false) {
	if html.firstLanguage.value == html.secondLanguage.value {
		return
	}
	if manual && html.fields.mode == "manual" && html.fields.manualReady && !html.fields.recording {
		html.fields.conversation.startRecording()
		html.fields.recording = true
		updateConversationStart(html)
		html.translationStatus.textContent = "Recording"
		return
	}
	if html.fields.running && (html.fields.mode == "conversation" || html.fields.recording) {
		return
	}
	stopConversationTranslation(html)
	const request = ++html.fields.request
	const languages = [html.firstLanguage.value, html.secondLanguage.value]
	const rows = new Map()
	html.fields.running = true
	html.fields.mode = manual ? "manual" : "conversation"
	html.fields.recording = manual
	html.fields.manualReady = false
	html.firstLanguage.disabled = true
	html.secondLanguage.disabled = true
	updateConversationStart(html)
	try {
		await html.fields.conversation.start({
			languages, manual,
			onTranscript: ({ id, sourceLanguage, source, translation, removed = false }) => {
				if request != html.fields.request {
					return
				}
				let row = rows.get(id)
				if removed {
					row?.element.remove()
					rows.delete(id)
					html.clearTranslations.hidden = !html.translationHistory.querySelector(".translate-turn")
					return
				}
				if !row {
					row = { texts: new Map(), element: null }
					const turn = document.createElement("article")
					turn.className = "translate-turn translate-pair"
					for const language of languages {
						const column = document.createElement("section")
						const heading = document.createElement("h2")
						heading.textContent = conversationLanguages[language]
						const text = document.createElement("p")
						text.className = "translate-result"
						text.lang = language
						row.texts.set(language, text)
						column.append(heading, text)
						turn.append(column)
					}
					row.element = turn
					rows.set(id, row)
					html.clearTranslations.hidden = false
					html.translationHistory.append(turn)
				}
				row.texts.get(sourceLanguage).textContent = source || "…"
				row.texts.get(languages.find(language => language != sourceLanguage)).textContent = translation
			},
			onStatus: (status, message) => { // allow-null
				if request != html.fields.request {
					return
				}
				if status == "error" {
					stopConversationTranslation(html)
					html.translationStatus.textContent = message
					return
				}
				if status == "listening" && manual {
					html.fields.manualReady = true
					updateConversationStart(html)
					html.translationStatus.textContent = message || (html.fields.recording ? "Recording" : "Translating…")
					return
				}
				html.translationStatus.textContent = message || (status == "connecting" ? "Connecting…" : status == "processing" ? "Translating…" : "Listening")
			},
			onSpeaking: speaking => {
				if !manual && request == html.fields.request && html.startConversation.classList.contains("is-listening") {
					html.translationStatus.textContent = speaking ? "Listening" : "Ready"
				}
			},
			onAudioBlocked: () => {
				if request == html.fields.request {
					html.enableTranslationAudio.hidden = false
				}
			},
		})
	}
	catch (error) {
		if request == html.fields.request {
			stopConversationTranslation(html)
			html.translationStatus.textContent = error.name == "NotAllowedError" ? "Microphone access was denied. Allow it in your browser and try again." : error.message
		}
	}
}

export default {
	page: { persistOnClose: true },
	fields: () => ({ request: 0, running: false, mode: null, recording: false, manualReady: false, conversation: new TranslationConversation() }),
	onFirstDomAdd: ({ html }) => {
		for const select of [html.firstLanguage, html.secondLanguage] {
			for const [code, label] of Object.entries(conversationLanguages) {
				const option = document.createElement("option")
				option.value = code
				option.textContent = label
				select.append(option)
			}
			select.addEventListener("change", () => updateConversationStart(html))
		}
		html.firstLanguage.value = "en"
		html.secondLanguage.value = "ja"
		updateConversationStart(html)
		html.startConversation.addEventListener("click", () => {
			if html.fields.running && html.fields.mode == "conversation" {
				stopConversationTranslation(html)
			}
			else {
				startConversationTranslation(html)
			}
		})
		html.startRecording.addEventListener("click", () => {
			if html.fields.recording {
				stopManualTranslationRecording(html)
			}
			else {
				startConversationTranslation(html, true)
			}
		})
		html.clearTranslations.addEventListener("click", () => {
			stopConversationTranslation(html)
			html.translationHistory.querySelectorAll(".translate-turn").forEach(turn => turn.remove())
			html.clearTranslations.hidden = true
		})
		html.enableTranslationAudio.addEventListener("click", async () => {
			const request = html.fields.request
			try {
				await html.fields.conversation.enableAudio()
				if request == html.fields.request {
					html.enableTranslationAudio.hidden = true
				}
			}
			catch {
				if request == html.fields.request {
					html.translationStatus.textContent = "Sound could not play. Tap Enable sound to try again."
				}
			}
		})
	},
	onDomRemove: ({ html }) => stopConversationTranslation(html),
}
