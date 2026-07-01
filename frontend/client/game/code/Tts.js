let voice = null
speechSynthesis.onvoiceschanged = () => {
	voice = speechSynthesis.getVoices().find((v) => {
		// return v.lang == "ja-JP"
		return v.lang == "zh-CN"
	})
}

export class Tts {
	constructor(text) {
		this.lang = "zh-CN"
		// this.lang = "ja-JP"
		//this.lang = "en-US"
		this.rate = 1
		this.pitch = 1
		if (text && voice) {
			this.speak(text)
		}
	}

	speak(text) {
		const utterance = new SpeechSynthesisUtterance(text)

		utterance.lang = this.lang
		utterance.rate = this.rate
		utterance.pitch = this.pitch
		utterance.voice = voice

		speechSynthesis.speak(utterance)
	}

	stop() {
		speechSynthesis.cancel()
	}
}










