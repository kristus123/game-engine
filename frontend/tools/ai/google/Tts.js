const lang = "zh-CN"

let voice = null
let fallbackVoice = null

const load = () => {
	console.log("loading voices")

	const voices = speechSynthesis.getVoices()

	console.log("available voices:")
	for (const v of voices) {
		console.log(v.name, "-", v.lang)
	}

	voice = voices.find(v => v.lang == "zh-CN")
		?? voices.find(v => v.lang == "en-US")
		?? voices[0]
		?? null
	console.log("chinese voice:", voice)
	console.log("english voice:", fallbackVoice)
}

speechSynthesis.onvoiceschanged = load
load()

export function Tts(text) {
	return new Promise((resolve, reject) => {
		const selectedVoice = voice ?? fallbackVoice

		if (selectedVoice == null) {
			reject(new Error("no voice loaded"))
			return
		}

		const u = new SpeechSynthesisUtterance(text)
		u.lang = selectedVoice.lang
		u.rate = 0.9
		u.pitch = 1
		u.voice = selectedVoice

		u.onend = resolve

		u.onerror = e => {
			console.error("TTS error:", e.error)
			reject(new Error(e.error))
		}

		speechSynthesis.speak(u)
		console.log("tts:", text, selectedVoice.lang)
	})
}
