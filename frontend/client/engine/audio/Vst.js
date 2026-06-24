export class Vst {
	static delay(time = 0.35) {
		const node = SoundContext.context.createDelay()
		node.delayTime.value = time
		return node
	}

	static filter(type = "lowpass", freq = 1200) {
		const node = SoundContext.context.createBiquadFilter()
		node.type = type
		node.frequency.value = freq
		return node
	}

	static compressor() {
		return SoundContext.context.createDynamicsCompressor()
	}

	static distortion(amount = 50) {
		const node = SoundContext.context.createWaveShaper()
		const makeDistortionCurve = (amt) => {
			const k = typeof amt == "number" ? amt : 50
			const n_samples = 44100
			const curve = new Float32Array(n_samples)
			const deg = Math.PI / 180
			for (let i = 0; i < n_samples; ++i) {
				const x = (i * 2) / n_samples - 1
				curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
			}
			return curve
		}
		node.curve = makeDistortionCurve(amount)
		node.oversample = "4x"
		return node
	}

	static limiter() {
		const compressor = SoundContext.context.createDynamicsCompressor()
		compressor.threshold.setValueAtTime(-1, SoundContext.context.currentTime)
		compressor.knee.setValueAtTime(0, SoundContext.context.currentTime)
		compressor.ratio.setValueAtTime(20, SoundContext.context.currentTime)
		compressor.attack.setValueAtTime(0.003, SoundContext.context.currentTime)
		compressor.release.setValueAtTime(0.05, SoundContext.context.currentTime)
		return compressor
	}

	static reverb(options = {}) {
		const context = SoundContext.context
		const decayTime = options.decay || 1.5
		const sampleRate = context.sampleRate
		const length = Math.floor(sampleRate * decayTime)

		// Synthesize a stereo impulse response of white noise with exponential decay
		const impulse = context.createBuffer(2, length, sampleRate)
		const left = impulse.getChannelData(0)
		const right = impulse.getChannelData(1)

		for (let i = 0; i < length; i++) {
			const decay = Math.exp(-i / (sampleRate * decayTime / 4))
			left[i] = (Math.random() * 2 - 1) * decay
			right[i] = (Math.random() * 2 - 1) * decay
		}

		const convolver = context.createConvolver()
		convolver.buffer = impulse

		const input = context.createGain()
		const output = context.createGain()

		const wetGain = context.createGain()
		const dryGain = context.createGain()

		wetGain.gain.value = options.wet ?? 0.5
		dryGain.gain.value = options.dry ?? 0.5

		input.connect(convolver)
		convolver.connect(wetGain)
		wetGain.connect(output)

		input.connect(dryGain)
		dryGain.connect(output)

		return { input, output }
	}

	static analyser(fftSize = 256) {
		const analyser = SoundContext.context.createAnalyser()
		analyser.fftSize = fftSize
		return analyser
	}
}
