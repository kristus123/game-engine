import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { AudioContext } from '/static/engine/audio/AudioContext.js'; 
import { BufferSource } from '/static/engine/audio/BufferSource.js'; 

export class AudioBuffer {
	constructor(url) {

				AssertNotNull(url, "argument url in " + this.constructor.name + ".js should not be null")
			
		this.url = url; 

		this.audioBuffer = null
		this.loaded = false

		fetch(url)
		  .then(r => r.arrayBuffer())
		  .then(arrayBuffer => AudioContext.decodeAudioData(arrayBuffer))
		  .then(a => {
				this.audioBuffer = a
				this.loaded = true
		  })
		  .catch(err => console.error('Error loading audio:', err))
	}

	duration() {
		return this.audioBuffer.duration

	}

	newPlayback() {
		const source = AudioContext.createBufferSource()
		source.buffer = this.audioBuffer
		source.connect(AudioContext.destination)
		source.start(0, startTime, this.barDuration)
		this.currentSource = source
	}
}
