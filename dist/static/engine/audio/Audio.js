import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { AudioEngine } from '/static/engine/audio/AudioEngine.js'; 

export class Audio {
	constructor(audioBuffer, bpm = 100) {

<<<<<<< HEAD
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
||||||| parent of 02090fa (x)
	static play() {
		const sound = new Howl({
			src: ['/static/audio/intro.wav'],
		})
=======
				AssertNotNull(audioBuffer, "argument audioBuffer in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(bpm, "argument bpm in " + this.constructor.name + ".js should not be null")
			
		this.audioBuffer = audioBuffer; 
		this.bpm = bpm; 
>>>>>>> 02090fa (x)

<<<<<<< HEAD
		sound.volume(0.5)

		sound.play()
||||||| parent of 02090fa (x)
		sound.play()
=======
		const beatsPerBar = 4 // todo try playing around with this number
		this.barDuration = (60 / bpm) * beatsPerBar

		this.audioEngine = new AudioEngine(audioBuffer)
>>>>>>> 02090fa (x)
	}
=======
>>>>>>> 238d9b4 (x)

<<<<<<< HEAD
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
||||||| parent of 02090fa (x)

	static breathing() {
		const sound = new Howl({
			src: ['/static/audio/astronaut_breathing.wav'],
		})

		sound.play()
	}


	static eat() {
		const sound = new Howl({
			src: ['/static/audio/eat.m4a'],
		})

		sound.play()
	}

	static poop() {
		const sound = new Howl({
			src: ['/static/audio/poop.wav'],
		})

		sound.play()
	}

	static music() {
		//const sound = new Howl({
		//	src: ['/static/audio/kristian_space_music.mp3'],
		//})
		//
		//sound.play()
=======
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
>>>>>>> 02090fa (x)
	}
}
