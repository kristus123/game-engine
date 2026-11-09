export class AudioEngine {
	constructor(audioBuffer) {
		this.audioBuffer = audioBuffer
		this.source = null
	}

	async play(startPosition = 0, duration = null) {
		if SoundContext.suspended {
			await SoundContext.context.resume()
		}

		this.stop()

		this.source = SoundContext.createBufferSource(this.audioBuffer)
		this.source.onended = () => {
			this.source = null
		}

		if duration == null {
			this.source.start(0, startPosition)
		}
		else {
			this.source.start(0, startPosition, duration)
		}
	}

	stop() {
		if this.source {
			try {
				this.source.stop()
			}
			catch (_) {
				// The source may already have ended.
			}

			this.source = null
		}
	}

	get duration() {
		return this.audioBuffer.duration
	}
}
