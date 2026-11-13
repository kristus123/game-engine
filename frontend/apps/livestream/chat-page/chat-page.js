function setDictationState(html, state, message = "") {
	html.fields.voiceState = state
	html.dictate.disabled = state == "opening" || state == "transcribing"
	html.dictate.content = state == "recording" ? "Stop" : "Speak"
	html.dictationStatus.content = message
}

function cancelDictation(html) {
	clearTimeout(html.fields.voiceTimer)
	html.fields.voiceController?.abort()
	html.fields.recording?.cancel()
	html.fields.recording = null
	html.fields.voiceController = null
	setDictationState(html, "idle")
}

export default {
	page: { persistOnClose: true },
	fields: () => ({ recording: null, voiceController: null, voiceTimer: null, voiceState: "idle" }),
	onFirstDomAdd: ({ html }) => {
		html.dictate.hidden = !Env.dev
		const addLine = ({ name, message }) => {
			html.chatHistory.add(H.create("chat-line", {
				slots: {
					name: name,
					message: message,
				},
			}))
			while (html.chatHistory.children.length > 200) {
				html.chatHistory.firstElementChild.remove()
			}
			html.chatHistory.scrollTop = html.chatHistory.scrollHeight
		}
		Chat.history.forEach(addLine)
		Chat.onMessage(addLine)
	},
	onDomRemove: ({ html }) => cancelDictation(html),
	methods: {
		close: () => Page.close(),
		toggleDictation: async (html) => {
			if html.fields.voiceState != "idle" && html.fields.voiceState != "recording" {
				return
			}
			const controller = html.fields.voiceController ?? new AbortController()
			html.fields.voiceController = controller
			try {
				if html.fields.recording {
					clearTimeout(html.fields.voiceTimer)
					const recording = html.fields.recording
					html.fields.recording = null
					setDictationState(html, "transcribing", "Transcribing…")
					const blob = await recording.stop()
					const text = await Transcribe(blob, { signal: controller.signal })
					if controller.signal.aborted || !html.isConnected {
						return
					}
					html.message.value = [html.message.value.trim(), text].filter(Boolean).join(" ").slice(0, 2_000)
					html.message.focus()
					setDictationState(html, "idle", text ? "Ready to send" : "No speech detected")
				}
				else {
					setDictationState(html, "opening", "Opening microphone…")
					const recording = await RecordAudio({
						signal: controller.signal,
						onError: () => {
							if html.fields.voiceController != controller || controller.signal.aborted {
								return
							}
							cancelDictation(html)
							setDictationState(html, "idle", "Microphone recording failed")
						},
					})
					if controller.signal.aborted || !html.isConnected {
						recording.cancel()
						return
					}
					html.fields.recording = recording
					setDictationState(html, "recording", "Recording… (up to 60s)")
					html.fields.voiceTimer = setTimeout(async () => {
						const options = await html.whenReady()
						if html.fields.voiceController == controller && !controller.signal.aborted {
							await options.methods.toggleDictation()
						}
					}, 60_000)
				}
			}
			catch (error) {
				if !controller.signal.aborted {
					setDictationState(html, "idle", error.message)
				}
			}
			finally {
				if html.fields.voiceController == controller && html.fields.voiceState != "recording" {
					controller.abort()
					html.fields.voiceController = null
				}
			}
		},
		sendMessage: (html) => {
			const message = html.message.value
			Chat.sendMessage(message)
			html.message.clear()
		},
	},
}
