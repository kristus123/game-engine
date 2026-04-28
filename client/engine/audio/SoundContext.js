export class SoundContext {

	static {
		this.context = new (window.AudioContext || window.webkitAudioContext)()

		this.gain = this.context.createGain()
		this.gain.connect(this.context.destination)
	}

	static decodeAudioData() {
		return this.context.decodeAudioData(b) // AudioBuffer
	}

	static async createBufferSource() {
		const s = await AudioContext.createBufferSource()
		s.buffer = this.audioBuffer
		s.connect(this.gain)

		return s
	}

	static get suspended() {
		return this.context.state == "suspended"
	}

}
