import { AudioContext } from '/static/engine/audio/AudioContext.js'; 

export class SineWave {

	static play(frequency = 890, type = 'sine', duration = 200) {
		const o = AudioContext.createOscillator()
		o.type = type
		o.frequency.setValueAtTime(frequency, AudioContext.currentTime)
		o.connect(AudioContext.destination)
		o.start()

		setTimeout(() => {
			o.stop()
			o.disconnect()
		}, duration)
	}
}
