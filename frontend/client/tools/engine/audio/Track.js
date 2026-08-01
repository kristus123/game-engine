export class Track {

	constructor() {
		this.input = SoundContext.createGain()
		this.output = this.input
	}

	get db() {
		return this.input.gain.value
	}

	set db(val) {
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
		if (SoundContext.suspended) {
			SoundContext.context.resume()
		}
		const buffer = sound?.buffer ?? sound // todo only use one. this is a hacky hack
		if (buffer) {
			const source = SoundContext.context.createBufferSource()
			source.buffer = buffer
			source.connect(this.input)
			source.start(0)
		}
	}

}
