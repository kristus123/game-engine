export function Tts(text, { language = "" } = {}) {
	return new Promise((resolve, reject) => {
		if !globalThis.speechSynthesis || typeof SpeechSynthesisUtterance == "undefined" {
			reject(new Error("Speech playback is unavailable in this browser"))
			return
		}
		const normalize = lang => lang.toLowerCase().replaceAll("_", "-")
		const voices = speechSynthesis.getVoices()
		const requested = normalize(language)
		const voice = language ? voices.find(item => normalize(item.lang) == requested) || voices.find(item => normalize(item.lang).split("-")[0] == requested.split("-")[0]) : TtsVoices.active
		const utterance = new SpeechSynthesisUtterance(text)
		if voice {
			utterance.voice = voice
		}
		utterance.lang = language || voice?.lang || "en-US"
		utterance.rate = 0.9
		utterance.pitch = 1
		utterance.onend = () => resolve()
		utterance.onerror = event => reject(new Error(`Speech playback failed (${event.error})`))
		speechSynthesis.cancel()
		speechSynthesis.speak(utterance)
	})
}
