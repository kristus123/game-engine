export function Tts(text) {
	return new Promise((resolve, reject) => {
		if (TtsVoices.active == null) {
			reject(new Error("no voice loaded"))
		}
		else {
			const u = new SpeechSynthesisUtterance(text)
			u.voice = TtsVoices.active
			u.lang = TtsVoices.active.lang
			u.rate = 0.9
			u.pitch = 1

			u.onend = () => {
				console.log("tts sucesss")
				resolve()
			}

			u.onerror = e => {
				console.error("TTS error:", e.error)
				reject(new Error(e.error))
			}

			speechSynthesis.cancel()
			speechSynthesis.speak(u)
		}
	})
}
