<<<<<<< HEAD
export class AudioEngine {
	constructor(audioBuffer) {
		this.currentBufferSource = null
	}

	stop() {
		if (this.currentBufferSource) {
			try {
				this.currentBufferSource.stop()
			}
			catch (_) {} // already stopped

			this.currentBufferSource.disconnect()
			this.currentBufferSource = null
		}
	}

	play(start = 0, end = null) {
		if (AudioContext.state === 'suspended') {
			AudioContext.resume()
		}
		else {
			this.stop()
			this.currentBufferSource = AudioContext.createBufferSource()
			this.currentBufferSource.buffer = this.audioBuffer
			this.currentBufferSource.connect(AudioContext.destination)

			if (end == null) {
				this.currentBufferSource.start(0, start)
			}
			else {
				this.currentBufferSource.start(0, start, end)
			}
		}
	}
}
||||||| parent of d52ba36 (x)
=======
export class AudioEngine {
	constructor(audioBuffer) {
		this.currentBufferSource = null
	}

	stop() {
		if (this.currentBufferSource) {
			try {
				this.currentBufferSource.stop()
			}
			catch (_) {} // already stopped

			this.currentBufferSource.disconnect()
			this.currentBufferSource = null
		}
	}

	play(start = 0, end = null) {
		if (AudioContext.state === 'suspended') {
			AudioContext.resume()
		}
		else {
			this.stop()
			this.currentBufferSource = AudioContext.createBufferSource()
			this.currentBufferSource.buffer = this.audioBuffer
			this.currentBufferSource.connect(AudioContext.destination)

			if (end == null) {
				this.currentBufferSource.start(0, start)
			}
			else {
				this.currentBufferSource.start(0, start, end)
			}
		}
	}
}
<<<<<<< HEAD

>>>>>>> d52ba36 (x)
||||||| parent of 02090fa (x)

=======
>>>>>>> 02090fa (x)
