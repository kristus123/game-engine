export class AudioEngine {
	constructor(audioBuffer) {
		this.source = null
	}

	async play(startPosition = 0, duration = null) {
		if (SoundContext.suspended) {
			await AudioContext.resume()
		}

		this.stop()

		this.source = SoundContext.createBufferSource(this.audioBuffer)

		// 0 = play immediately
		this.source.start(0, startPosition, duration)

		this.source.onended = () => {
			this.source = null
		}
	}

	stop() {
		if (this.source) {
			try {
				this.source.stop()
			}
			catch (_) {
				// do nothing
			}

			this.source = null
		}
		else {
			// do nothing
		}
	}

	get duration() {
		if (this.source) {
			return this.source.duration
		}
		else {
			throw new Error("this.source is not present")
		}
	}
}
