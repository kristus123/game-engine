// const lang = "en-US"
const lang = "zh-CN"

let loaded = false
let voice = null


// to stop it, use
// speechSynthesis.cancel()

export async function Tts(text) {
	if (!loaded) {
		const load = () => {
			voice = speechSynthesis.getVoices()
				.find(v => v.lang == lang)
			loaded = true
		}

		window.addEventListener("pointerdown", load, { once: true })
		window.addEventListener("touchstart", load, { once: true })
	}

	return new Promise(resolve => {
		const utterance = new SpeechSynthesisUtterance(text)

		utterance.lang = lang
		utterance.rate = 0.9
		utterance.pitch = 1

		if (voice) {
			utterance.voice = voice
		}

		utterance.onend = resolve

		speechSynthesis.speak(utterance)
	})
}
