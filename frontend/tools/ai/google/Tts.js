// const lang = "en-US"
const lang = "zh-CN"

let voice = null

const load = () => {
	console.log("loading voices")
	voices = speechSynthesis.getVoices()

	voice = voices.find(v => v.lang == lang)
		?? voices[0] ?? null
}

speechSynthesis.onvoiceschanged = load
load()

// To stop it, use
// speechSynthesis.cancel()

export async function Tts(text) {
	return new Promise((resolve, reject) => {
		if (voice) {
			const u = new SpeechSynthesisUtterance(text)
			u.lang = lang
			u.rate = 0.9
			u.pitch = 1

			u.onend = resolve
			u.onerror = reject

			u.voice = voice
			speechSynthesis.speak(u)
			console.log("tts: " + text)
		}
		else {
			console.log("voice not loaded")
			reject()
		}
	})
}
