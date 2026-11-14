export class RealTimeTranslate {
	translatedAudio = new Audio()
	translatedText = ""
	sourceText = ""
	current = null

	async start({ language = "ja", onTranscript = () => {}, onStatus = () => {}, onAudioBlocked = () => {}, onAudioStream = null, stream = null } = {}) { // allow-null
		this.stop()
		if !navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection == "undefined" {
			throw new Error("Microphone translation needs HTTPS or localhost and a browser with WebRTC.")
		}
		const session = { controller: new AbortController(), pc: null, events: null, stream: null, timeout: null, ownsStream: !stream }
		this.current = session
		this.translatedText = ""
		this.sourceText = ""
		const active = () => this.current == session
		const signal = AbortSignal.any([session.controller.signal, AbortSignal.timeout(30_000)])
		try {
			onStatus("connecting")
			stream = stream || await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false })
			if !active() {
				if session.ownsStream {
					stream.getTracks().forEach(track => track.stop())
				}
				return
			}
			session.stream = stream
			const response = await fetch(`${Config.httpUrl}/translationSession`, {
				method: "POST",
				headers: { "Content-Type": "application/json", token: Token.encodedToken ?? "null" },
				body: JSON.stringify({ language }),
				signal,
			})
			if !response.ok {
				const failure = await response.json().catch(() => ({}))
				throw new Error(failure.error || "Could not start translation. Check the backend and API key.")
			}
			const { value } = await response.json()
			if !active() {
				return
			}
			const pc = new RTCPeerConnection()
			session.pc = pc
			const fail = message => {
				if active() {
					this.stop()
					onStatus("error", message)
				}
			}
			session.timeout = setTimeout(() => fail("Connection timed out. Tap Start conversation to retry."), 25_000)
			stream.getTracks().forEach(track => {
				pc.addTrack(track, stream)
				if session.ownsStream {
					track.onended = () => fail("Microphone disconnected. Tap Start conversation to reconnect.")
				}
			})
			pc.onconnectionstatechange = () => {
				if !active() {
					return
				}
				if pc.connectionState == "connected" {
					clearTimeout(session.timeout)
					onStatus("listening")
				}
				if ["failed", "disconnected", "closed"].includes(pc.connectionState) {
					fail("Connection interrupted. Tap Start conversation to reconnect.")
				}
			}
			pc.ontrack = ({ streams }) => {
				if !active() {
					return
				}
				if typeof onAudioStream == "function" {
					try {
						onAudioStream(streams[0])
					}
					catch {
						fail("Could not play translation audio. Please start again.")
					}
					return
				}
				this.translatedAudio.srcObject = streams[0]
				this.translatedAudio.play().catch(() => {
					if active() {
						onAudioBlocked()
					}
				})
			}
			const events = pc.createDataChannel("oai-events")
			session.events = events
			events.onmessage = ({ data }) => {
				if !active() {
					return
				}
				try {
					const event = JSON.parse(data)
					if event.type == "error" {
						fail(event.error?.message || "Translation failed. Please try again.")
					}
					if event.type == "session.input_transcript.delta" {
						this.sourceText += event.delta
					}
					if event.type == "session.output_transcript.delta" {
						this.translatedText += event.delta
					}
					onTranscript({ source: this.sourceText, translation: this.translatedText, event })
				}
				catch {
					fail("Could not read translation events. Please reconnect.")
				}
			}
			events.onclose = () => fail("Translation ended. Tap Start conversation to start again.")
			events.onerror = () => fail("Translation connection failed. Please reconnect.")
			const offer = await pc.createOffer()
			await pc.setLocalDescription(offer)
			const answer = await fetch("https://api.openai.com/v1/realtime/translations/calls", {
				method: "POST",
				headers: { Authorization: `Bearer ${value}`, "Content-Type": "application/sdp" },
				body: offer.sdp,
				signal,
			})
			if !answer.ok {
				throw new Error(`Translation connection failed (${answer.status}). Please retry.`)
			}
			const sdp = await answer.text()
			if active() {
				await pc.setRemoteDescription({ type: "answer", sdp })
			}
		}
		catch (error) {
			if active() {
				this.stop()
				throw error
			}
		}
	}

	stop() {
		const session = this.current
		this.current = null
		if session {
			clearTimeout(session.timeout)
			session.controller.abort()
			session.events?.close()
			session.pc?.close()
			if session.ownsStream {
				session.stream?.getTracks().forEach(track => track.stop())
			}
		}
		this.translatedAudio.pause()
		this.translatedAudio.srcObject = null
	}
}
