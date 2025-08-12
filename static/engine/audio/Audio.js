export class Audio {
	constructor(audioBuffer, bpm = 100) {
		const beatsPerBar = 4 // todo try playing around with this number
		this.barDuration = (60 / bpm) * beatsPerBar

<<<<<<< HEAD
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
||||||| parent of 02090fa (x)
	static play() {
		const sound = new Howl({
			src: ['/static/audio/intro.wav'],
		})

		sound.play()
=======
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
