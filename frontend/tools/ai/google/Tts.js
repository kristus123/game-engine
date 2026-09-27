// const lang = "en-US"
const lang = "zh-CN"

let voice = null

const load = () => {
	console.log("loading voices")
	const voices = speechSynthesis.getVoices()

	voice = voices.find(v => v.lang == lang)
		?? voices[0] ?? null
	console.log("voice: " + voice)
}

speechSynthesis.onvoiceschanged = load
load()

// To stop it, use
// speechSynthesis.cancel()

export async function Tts(text) {
	return new Promise((resolve, reject) => {
		if (voice == null) {
			console.error("voice not loaded")
			reject(new Error("voice not loaded"))
		}
		else {
			const u = new SpeechSynthesisUtterance(text)
			u.lang = lang
			u.rate = 0.9
			u.pitch = 1

			u.onend = e => {
				console.log("tts success")
				resolve()
			}
			u.onerror = e => {
				console.error("TTS error:", e.error)
				reject(new Error(e.error))
			}

			u.voice = voice
			speechSynthesis.speak(u)
			console.log("tts: " + text)
		}
	})
}
