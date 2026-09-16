export class SoundContext {

	static {
		this.context = new (window.AudioContext || window.webkitAudioContext)()

		this.globalGain = this.context.createGain()
		this.globalGain.connect(this.context.destination)
	}

	static get destination() {
		return this.context.destination
	}

	static set destination(d) {
		this.context.destination = d
	}

	static async setSinkId(deviceId) {
		await this.context.setSinkId(deviceId)
	}

	static createOscillator() {
		return this.context.createOscillator()
	}

	static createGain() {
		return this.context.createGain()
	}

	static createBiquadFilter() {
		return this.context.createBiquadFilter()
	}

	static decodeAudioData(b) {
		return this.context.decodeAudioData(b)
		// returns
		// AudioBuffer
	}

	static createBufferSource(audioBuffer) {
		const s = this.context.createBufferSource()
		s.buffer = audioBuffer
		s.connect(this.globalGain)

		return s
	}

	static get suspended() {
		return this.context.state == "suspended"
	}

	static async routeMicrophoneTo(track) {
		try {
			const source = this.context.createMediaStreamSource(
				await MediaDevices.audio(this.deviceId))

			source.connect(track.input ?? track)
			return source
		}
		catch (e) {
			console.error("Error", e)
			throw e
		}
	}


}
