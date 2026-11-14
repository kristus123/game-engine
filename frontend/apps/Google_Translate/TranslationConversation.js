export class TranslationConversation {
	current = null
	muted = false
	clients = []
	player = new Audio()

	async start({ manual = false, languages = null, onTranscript = () => {}, onStatus = () => {}, onAudioBlocked = () => {}, onSpeaking = () => {} } = {}) { // allow-null
		this.stop()
		languages = languages || ["en", "ja"]
		if languages.length != 2 || languages[0] == languages[1] || languages.some(language => !["en", "ja", "zh"].includes(language)) {
			throw new Error("Choose two different supported languages")
		}
		const Context = window.AudioContext || window.webkitAudioContext
		if !Context || !navigator.mediaDevices?.getUserMedia || (typeof MediaRecorder == "undefined" || typeof RTCPeerConnection == "undefined") {
			throw new Error("Voice conversation needs microphone recording support and HTTPS or localhost")
		}
		const context = new Context()
		context.resume().catch(onAudioBlocked)
		const session = { context, stream: null, source: null, analyser: null, clients: [], captures: [], ready: new Set(), timer: null, queue: [], playing: false, draining: false, blocked: false, speaking: false, lastVoice: 0, nextId: 0, manual, manualRecording: manual, onSpeaking }
		session.speaking = manual
		this.current = session
		const active = () => this.current == session
		const playNext = () => {
			if !active() || this.muted || session.blocked {
				return
			}
			if session.queue.length == 0 {
				if !session.playing && !session.captures.some(capture => capture.pendingAudio) {
					session.draining = false
				}
				return
			}
			// Once the phone starts, finish the queued speech and its incoming
			// continuation clips even if the microphone becomes active again.
			if session.speaking && !session.draining {
				return
			}
			while (session.queue.length > 0 && !session.playing) {
				const clip = session.queue[0]
				const original = clip.caption || clip.voice.segment
				const caption = original?.reroutedTo || original
				if !IsTranslationEcho(caption, clip.language) {
					break
				}
				URL.revokeObjectURL(session.queue.shift().url)
			}
			if session.queue.length == 0 {
				return
			}
			if !session.playing {
				session.playing = true
				session.draining = true
				this.player.src = session.queue[0].url
			}
			if this.player.paused {
				this.player.play().catch(error => {
					if active() && !this.muted && error.name != "AbortError" {
						session.blocked = true
						onAudioBlocked()
					}
				})
			}
		}
		session.playNext = playNext
		this.player.onended = () => {
			if active() {
				const previous = session.queue.shift()
				if previous {
					URL.revokeObjectURL(previous.url)
				}
				session.playing = false
				playNext()
			}
		}
		this.player.onerror = () => {
			if active() {
				session.blocked = true
				onStatus("listening", "Voice playback failed. Tap Enable sound to retry.")
				onAudioBlocked()
			}
		}
		try {
			onStatus("connecting")
			const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false })
			if !active() {
				stream.getTracks().forEach(track => track.stop())
				return
			}
			session.stream = stream
			if manual {
				stream.getAudioTracks().forEach(track => {
					track.enabled = session.manualRecording
				})
			}
			session.source = context.createMediaStreamSource(stream)
			session.analyser = context.createAnalyser()
			session.analyser.fftSize = 2048
			session.source.connect(session.analyser)
			const samples = new Float32Array(2048)
			session.timer = setInterval(() => {
				if !active() {
					return
				}
				session.analyser.getFloatTimeDomainData(samples)
				const level = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length)
				const now = performance.now()
				if level > 0.018 {
					session.lastVoice = now
				}
				const speaking = session.manual ? session.manualRecording : session.lastVoice > 0 && now - session.lastVoice < 900
				if speaking != session.speaking {
					session.speaking = speaking
					onSpeaking(speaking)
				}
				session.captures.forEach(capture => capture.poll(now))
				playNext()
			}, 100)
			stream.getTracks().forEach(track => {
				track.onended = () => {
					if active() {
						this.stop()
						onStatus("error", "Microphone disconnected. Start again to reconnect.")
					}
				}
			})
			const fail = message => {
				if active() {
					this.stop()
					onStatus("error", message)
				}
			}
			// Serialize credential requests; the backend permits one pending request
			// per user. Both sessions then receive the same microphone continuously.
			for const language of languages {
				if !active() {
					return
				}
				const index = session.clients.length
				const client = this.clients[index] || new RealTimeTranslate()
				this.clients[index] = client
				session.clients.push(client)
				const captions = { segments: [], latestInput: null }
				const published = new Map()
				const voice = { segment: null }
				await client.start({
					language, stream,
					onAudioStream: remote => {
						if !active() {
							return
						}
						const capture = CaptureTranslationVoice(context, remote, blob => {
							if active() && !this.muted {
								if session.queue.length >= 60 {
									fail("Spoken translation has fallen behind. Start again; captions are kept.")
									return
								}
								session.queue.push({ url: URL.createObjectURL(blob), language, voice, caption: voice.segment })
								playNext()
							}
						}, fail, onAudioBlocked)
						capture.setMuted(this.muted)
						session.captures.push(capture)
					},
					onTranscript: ({ event }) => {
						if active() {
							const segment = UpdateRealtimeCaption(captions, event, () => session.nextId++, languages, language)
							if segment {
								voice.segment = segment
								for const caption of captions.segments {
									const sourceLanguage = caption.sourceLanguage || languages.find(value => value != language)
									const visible = caption.translation && !IsTranslationEcho(caption, language) && sourceLanguage != language
									if !visible {
										if published.has(caption.id) {
											published.delete(caption.id)
											onTranscript({ id: caption.id, removed: true })
										}
										continue
									}
									const signature = JSON.stringify([sourceLanguage, caption.source, caption.translation])
									if published.get(caption.id) != signature {
										published.set(caption.id, signature)
										onTranscript({ ...caption, sourceLanguage, targetLanguage: language })
									}
								}
								playNext()
							}
						}
					},
					onStatus: (status, message) => { // allow-null
						if !active() {
							return
						}
						if status == "error" {
							fail(message)
						}
						if status == "listening" {
							session.ready.add(language)
							if session.ready.size == 2 {
								onStatus("listening")
							}
						}
					},
				})
			}
		}
		catch (error) {
			if active() {
				this.stop()
				throw error
			}
		}
	}

	startRecording() {
		const session = this.current
		if !session?.manual {
			throw new Error("Manual recording mode is not active")
		}
		session.manualRecording = true
		session.speaking = true
		session.stream?.getAudioTracks().forEach(track => {
			track.enabled = true
		})
		session.onSpeaking(true)
	}

	stopRecording() {
		const session = this.current
		if !session?.manual {
			return
		}
		session.manualRecording = false
		session.speaking = false
		session.stream?.getAudioTracks().forEach(track => {
			track.enabled = false
		})
		session.onSpeaking(false)
		session.playNext()
	}

	setMuted(muted) {
		this.muted = muted
		this.current?.captures.forEach(capture => capture.setMuted(muted))
		if muted {
			this.player.pause()
			if this.current {
				this.current.queue.forEach(clip => URL.revokeObjectURL(clip.url))
				this.current.queue = []
				this.current.playing = false
				this.current.draining = false
			}
		}
	}

	async enableAudio() {
		this.setMuted(false)
		if this.current {
			this.current.blocked = false
			this.current.playNext()
			await Promise.all([this.current.context.resume(), ...this.current.captures.map(capture => capture.resume())])
		}
	}

	stop() {
		const session = this.current
		this.current = null
		this.player.onended = null
		this.player.onerror = null
		this.player.pause()
		this.player.removeAttribute("src")
		this.player.load()
		if session {
			clearInterval(session.timer)
			session.clients.forEach(client => client.stop())
			session.captures.forEach(capture => capture.stop())
			session.queue.forEach(clip => URL.revokeObjectURL(clip.url))
			session.source?.disconnect()
			session.analyser?.disconnect()
			session.stream?.getTracks().forEach(track => track.stop())
			session.context.close().catch(() => {})
		}
	}
}
