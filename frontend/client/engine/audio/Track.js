export class Track {
	constructor(name) {
		this.name = name
		this.input = SoundContext.createGain()
		this.output = this.input
	}

	get volume() {
		return this.input.gain.value
	}

	set volume(val) {
		this.input.gain.value = val
	}

	routeTo(target) {
		this.output.connect(target.input ?? target)
		return target
	}

	apply(effect) {
		this.output.connect(effect.input ?? effect)
		this.output = effect.output ?? effect
		return this
	}

	play(audioBuffer) {
		if (SoundContext.suspended) {
			SoundContext.context.resume()
		}
		const buffer = audioBuffer?.buffer ?? audioBuffer
		if (!buffer) return
		const source = SoundContext.context.createBufferSource()
		source.buffer = buffer
		source.connect(this.input)
		source.start(0)
		return source
	}

	addAnalyser() {
		const analyser = SoundContext.context.createAnalyser()
		analyser.fftSize = 256
		this.apply(analyser)
		return analyser
	}
}
