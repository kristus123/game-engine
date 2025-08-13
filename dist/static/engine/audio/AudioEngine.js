import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { AudioContext } from '/static/engine/audio/AudioContext.js'; 

export class AudioEngine {
	constructor(audioBuffer) {

				AssertNotNull(audioBuffer, "argument audioBuffer in " + this.constructor.name + ".js should not be null")
			
		this.audioBuffer = audioBuffer; 

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
		if (!this.audioBuffer) {
			console.warn('Audio not loaded yet. Call play() after it is ready.')
			return
		}

		if (AudioContext.state === 'suspended') {
			AudioContext.resume()
		}

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

