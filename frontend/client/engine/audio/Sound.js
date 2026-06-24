class SoundClass {

	static init() {}

	static playBlob(blob) {
		const url = URL.createObjectURL(blob)
		const audio = new Audio(url)

		audio.play()
	}

	static playBuffer(buffer) {
		if (SoundContext.suspended) {
			SoundContext.context.resume()
		}
		const source = SoundContext.createBufferSource(buffer)
		source.start(0)
	}

	static async routeMicTo(track) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			const source = SoundContext.context.createMediaStreamSource(stream)
			source.connect(track.input)
			return source
		}
		catch (e) {
			console.error("Error accessing microphone:", e)
		}
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
