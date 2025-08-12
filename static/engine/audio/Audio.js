export class Audio {
	constructor(audioBuffer, bpm = 100) {
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
