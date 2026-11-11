export class AudioTrack {

	constructor() {
		this.input = SoundContext.createGain()
		this.output = this.input
		this.sources = new Set()
		this.analyser = Vst.analyser(512)
		this.levelBuffer = new Float32Array(this.analyser.fftSize)
		this.input.connect(this.analyser)
	}

	get db() {
		this.analyser.getFloatTimeDomainData(this.levelBuffer)
		let sum = 0
		for const sample of this.levelBuffer {
			sum += sample * sample
		}
		const rms = Math.sqrt(sum / this.levelBuffer.length)
		return rms == 0 ? -Infinity : 20 * Math.log10(rms)
	}

	get gain() {
		return this.input.gain.value
	}

	set gain(val) {
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

	play(sound) {
		if SoundContext.suspended {
			SoundContext.context.resume()
		}

		const buffer = sound?.buffer ?? sound
		if !buffer {
			return null
		}

		const source = SoundContext.context.createBufferSource()
		source.buffer = buffer
		source.connect(this.input)
		source.onended = () => this.sources.delete(source)
		this.sources.add(source)

		const startTime = sound?.startTime ?? 0
		if sound?.duration == null {
			source.start(0, startTime)
		}
		else {
			source.start(0, startTime, sound.duration)
		}

		return source
	}

	stop() {
		for const source of this.sources {
			try {
				source.stop()
			}
			catch (_) {
				// The source may already have ended.
			}
		}
		this.sources.clear()
	}
}
