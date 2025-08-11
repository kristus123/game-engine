async function loadAudio(url) {
	try {
		const r = await fetch(url)
		const arrayBuffer = await r.arrayBuffer()
		return await AudioContext.decodeAudioData(arrayBuffer)
	}
	catch (err) {
		console.error('Error loading audio:', err)
		return null
	}
}


export class TestAudio {
	constructor(audioBuffer, bpm = 100) {
		const beatsPerBar = 4 // todo try out playing around with this number
		this.barDuration = (60 / bpm) * beatsPerBar

		this.currentBufferSource = null

	}

	createBufferSource(audioBuffer, barNumber) {
		const s = AudioContext.createBufferSource()

		s.buffer = audioBuffer
		s.connect(AudioContext.destination)
		s.start(0, this.startTime(barNumber), this.barDuration)

		return s
	}

	startTime(barNumber) {
		return (barNumber - 1) * this.barDuration
	}

	stop() {
		 if (this.currentBufferSource) {
			try {
				this.currentBufferSource.stop()
			} catch (_) {} // already stopped 

			this.currentBufferSource.disconnect()
			this.currentBufferSource = null
		}
	}

	play(barNumber) {
		if (!this.audioBuffer) {
			console.warn('Audio not loaded yet. Call play() after it is ready.')
		}
		else if (barNumber < 1) {
			throw new Error('Bar number must be >= 1')
		}
		else if (AudioContext.state === 'suspended') {
			AudioContext.resume()
		}
		else if (this.startTime(barNumber) >= this.audioBuffer.duration) {
			throw new Error('Bar number exceeds audio duration')
		}
		else {
			this.stop()
			this.currentBufferSource = this.createBufferSource(this.audioBuffer, barNumber)
		}
	}
}
