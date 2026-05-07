export class SoundContext {

	static {
		this.context = new (window.AudioContext || window.webkitAudioContext)()

		this.globalGain = this.context.createGain()
		this.globalGain.connect(this.context.destination)
	}

	static decodeAudioData() {
		return this.context.decodeAudioData(b) // AudioBuffer
	}

	static async createBufferSource(audioBuffer) {
		const s = await AudioContext.createBufferSource()
		s.buffer = audioBuffer
		s.connect(this.globalGain)

		return s
	}

	static get suspended() {
		return this.context.state == "suspended"
	}

}
