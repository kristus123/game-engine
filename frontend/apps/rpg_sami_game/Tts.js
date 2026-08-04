export class Tts {
	constructor(text) {
		this.lang = "zh-CN"
		this.rate = 0.9
		this.pitch = 1
		this.voice = null

		this.initVoices()

		if (text) {
			this.speak(text)
		}
	}

	initVoices() {
		const load = () => {
			const voices = speechSynthesis.getVoices()
			this.voice = voices.find(v => v.lang == this.lang)
		}

		load()

		window.addEventListener("pointerdown", load, { once: true })
		window.addEventListener("touchstart", load, { once: true })
	}

	speak(text) {
		const utterance = new SpeechSynthesisUtterance(text)

		utterance.lang = this.lang
		utterance.rate = this.rate
		utterance.pitch = this.pitch

		if (this.voice) {
			utterance.voice = this.voice
		}

		speechSynthesis.speak(utterance)
	}

	stop() {
		speechSynthesis.cancel()
	}
}
