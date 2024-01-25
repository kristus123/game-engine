/* eslint-disable no-undef, */ // Ignore Howl import warning

export class AudioEngine {

	static play() {
		const sound = new Howl({
			src: ['/static/audio/intro.wav']
		})

		sound.play()
	}
}

