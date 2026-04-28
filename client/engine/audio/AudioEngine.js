export class AudioEngine {
	constructor(audioBuffer) {
		this.source = null;
	}

	async play(offset = 0, duration = null) {
		if (SoundContext.suspended) {
			await AudioContext.resume()
		}

		this.stop();

		this.source = SoundContext.createBufferSource(this.audioBuffer)

		this.source.start(0, offset, duration);

		this.source.onended = () => {
			this.source = null;
		}
	}

	stop() {
		if (this.source) {
			try {
				this.source.stop();
			} catch (_) {
				// do nothing
			}

			this.source = null;
		}
		else {
			// do nothing
		}
	}
}
