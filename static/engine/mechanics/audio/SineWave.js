export class SineWave {
	static audioCtx = new (window.AudioContext || window.webkitAudioContext)()

	static play(frequency = 890, type = 'square', duration = 100) {
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