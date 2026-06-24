export class AudioSheet {

	constructor(audioBuffer, bpm = 100) {
		this.audioEngine = AudioEngine(audioBuffer)

		const beatsPerBar = 4 // todo try playing around with this number for fun
		this.barDuration = (60 / bpm) * beatsPerBar
	}

	stop() {
		this.audioEngine.stop()
	}

	play(barNumber) {
		const startTime = (barNumber - 1) * this.barDuration

		if (barNumber < 1) {
			throw new Error("Bar number must be >= 1")
		}
		else if (startTime >= this.audioBuffer.duration) {
			throw new Error("Bar number exceeds audio duration")
		}
		else {
			this.audioEngine.play(startTime, this.barDuration)
		}
	}

	playRandom() {
		const totalBars = Math.floor(this.audioEngine.duration / this.barDuration)

		if (totalBars < 1) {
			throw new Error("Bar number must be >= 1")
		}
		else {
			const randomBar = Math.floor(Math.random() * totalBars) + 1
			this.play(randomBar)
		}
	}

}
