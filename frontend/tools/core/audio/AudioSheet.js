export class AudioSheet {
	constructor(audioBuffer, bpm = 100) {
		if (!audioBuffer) {
			throw new Error("AudioSheet requires an audio buffer")
		}
		if (!Number.isFinite(bpm) || bpm <= 0) {
			throw new Error("AudioSheet BPM must be a positive number")
		}

		this.audioBuffer = audioBuffer
		this.audioEngine = AudioEngine(audioBuffer)
		this.bpm = bpm
		this.beatsPerBar = 4
		this.barDuration = (60 / bpm) * this.beatsPerBar
	}

	stop() {
		this.audioEngine.stop()
	}

	playAll() {
		return this.audioEngine.play(0)
	}

	play(barNumber, durationInBars = 1) {
		if (!Number.isFinite(barNumber) || barNumber < 1) {
			throw new Error("Bar number must be >= 1")
		}
		if (!Number.isFinite(durationInBars) || durationInBars <= 0) {
			throw new Error("Duration in bars must be greater than zero")
		}

		return this.playBeats((barNumber - 1) * this.beatsPerBar, durationInBars * this.beatsPerBar)
	}

	createCue(startBeat, durationInBeats) {
		if (!Number.isFinite(startBeat) || startBeat < 0) {
			throw new Error("Start beat must be a non-negative number")
		}
		if (!Number.isFinite(durationInBeats) || durationInBeats <= 0) {
			throw new Error("Duration in beats must be greater than zero")
		}

		const startTime = startBeat * 60 / this.bpm
		const duration = durationInBeats * 60 / this.bpm
		if (startTime >= this.audioBuffer.duration || startTime + duration > this.audioBuffer.duration + 0.05) {
			throw new Error("Requested beat range exceeds audio duration")
		}

		return {
			buffer: this.audioBuffer,
			startTime,
			duration: Math.min(duration, this.audioBuffer.duration - startTime),
			startBeat,
			durationInBeats,
		}
	}

	playBeats(startBeat, durationInBeats) {
		const cue = this.createCue(startBeat, durationInBeats)
		return this.audioEngine.play(cue.startTime, cue.duration)
	}

	playRandom() {
		const totalBars = Math.floor(this.audioBuffer.duration / this.barDuration)
		if (totalBars < 1) {
			throw new Error("Audio is shorter than one bar")
		}

		const randomBar = Math.floor(Math.random() * totalBars) + 1
		return this.play(randomBar)
	}
}
