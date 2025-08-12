import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { AudioEngine } from '/static/engine/audio/AudioEngine.js'; 

export class Audio {
	constructor(audioBuffer, bpm = 100) {

				AssertNotNull(audioBuffer, "argument audioBuffer in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(bpm, "argument bpm in " + this.constructor.name + ".js should not be null")
			
		this.audioBuffer = audioBuffer; 
		this.bpm = bpm; 

		const beatsPerBar = 4 // todo try playing around with this number
		this.barDuration = (60 / bpm) * beatsPerBar

		this.audioEngine = new AudioEngine(audioBuffer)
	}

<<<<<<< HEAD
	stop() {
		this.audioEngine.stop()
	}
||||||| parent of 238d9b4 (x)
	static click() {
		const sound = new Howl({
			src: ['/static/audio/click.mp3'],
		})

		sound.volume(0.5)

		sound.play()
	}
=======
>>>>>>> 238d9b4 (x)

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
}
