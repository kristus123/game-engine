import { AudioContext } from '/static/engine/audio/AudioContext.js'; 

export class BufferSource {
	constructor() {


		const s = AudioContext.createBufferSource()

		s.buffer = this.audioBuffer
		s.connect(AudioContext.destination)
		s.start(0, startTime, this.barDuration)

		this.currentSource = s
	}
}
