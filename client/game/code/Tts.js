export class Tts {
	constructor() {
		this.lang = "en-US"
		this.rate = 1
		this.pitch = 1

		this.voice = null

		speechSynthesis.onvoiceschanged = () => {
			const voices = speechSynthesis.getVoices()
			console.log("Available voices:", voices)

			this.voice = voices[0]
		}
	}

	speak(text) {
		const utterance = new SpeechSynthesisUtterance(text)

		utterance.lang = this.lang
		utterance.rate = this.rate
		utterance.pitch = this.pitch
		utterance.voice = this.voice

		speechSynthesis.speak(utterance)
	}

	stop() {
		speechSynthesis.cancel()
	}
}