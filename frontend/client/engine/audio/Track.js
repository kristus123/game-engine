export class Track {

	static {
		const lowpass = SoundContext.createBiquadFilter()

		lowpass.type = "lowpass"
		lowpass.frequency.value = 200

		lowpass.connect(SoundContext.destination)

		this.lowpass = lowpass
	}

	static test() {

		const osc1 = SoundContext.createOscillator()
		osc1.frequency.value = 440 // A4
		osc1.connect(this.lowpass)

		const osc2 = SoundContext.createOscillator()
		osc2.frequency.value = 660 // E5
		osc2.connect(this.lowpass)

		osc1.start()
		osc2.start()
	}
}
