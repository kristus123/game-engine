export class SineWave {
	static audioCtx = new (window.AudioContext || window.webkitAudioContext)()

	static play(frequency = 890, type = 'sine', duration = 500) {
		const oscillator = SineWave.audioCtx.createOscillator()
		oscillator.type = type
		oscillator.frequency.setValueAtTime(frequency, SineWave.audioCtx.currentTime)
		oscillator.connect(SineWave.audioCtx.destination)
		oscillator.start()
		setTimeout(() => {
			oscillator.stop()
			oscillator.disconnect()
		}, duration)
	}

}
