import { Random } from '/static/engine/Random.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { AudioEngine } from '/static/engine/audio/AudioEngine.js'; 

export class AudioSheet {
	constructor(audioBuffer, bpm = 100) {

				AssertNotNull(audioBuffer, "argument audioBuffer in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(bpm, "argument bpm in " + this.constructor.name + ".js should not be null")
			
		this.audioBuffer = audioBuffer; 
		this.bpm = bpm; 

		const beatsPerBar = 4 // todo try playing around with this number for fun
		this.barDuration = (60 / bpm) * beatsPerBar

		this.audioEngine = new AudioEngine(audioBuffer)
	}

	stop() {
		this.audioEngine.stop()
	}

	play(barNumber) {
		const startTime = (barNumber - 1) * this.barDuration

		if (barNumber < 1) {
			throw new Error('Bar number must be >= 1')
		}
		else if (startTime >= this.audioBuffer.duration) {
			throw new Error('Bar number exceeds audio duration')
		}
		else {
			this.audioEngine.play(startTime, this.barDuration)
		}
	}

	playRandom() {
		const totalBars = Math.floor(this.audioEngine.audioBuffer.duration / this.barDuration)
		if (totalBars < 1) {
			return
		}
		const randomBar = Math.floor(Math.random() * totalBars) + 1
		this.play(randomBar)
	}

}
