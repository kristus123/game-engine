class SoundClass {

	static init() { }

	static async playBlob(blob) {
		const url = URL.createObjectURL(blob)
		const audio = await this.createAudio(url)
		audio.play()
	}

	static async createAudio(url) {
		const audio = new Audio(url)
		if (ActiveSpeaker.active) {
			await audio.setSinkId(ActiveSpeaker.active)
		}
		return audio
	}

	static playBuffer(buffer) {
		if (SoundContext.suspended) {
			SoundContext.context.resume()
		}
		const source = SoundContext.createBufferSource(buffer)
		source.start(0)
	}
}

export const Sound = new Proxy(SoundClass, {
	get(target, prop) {
		if (prop in target) {
			return target[prop]
		}

		if (AudioBuffers[prop]) {
			const playFn = (...args) => {
				const track = args[0] || null
				if (track) {
					return track.play(AudioBuffers[prop])
				}
				else {
					return SoundClass.playBuffer(AudioBuffers[prop])
				}
			}
			playFn.buffer = AudioBuffers[prop]
			return playFn
		}

		return undefined
	}
})
