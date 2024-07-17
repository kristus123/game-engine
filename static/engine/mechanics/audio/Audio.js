/* eslint-disable no-undef, */ // Ignore Howl import warning

export class Audio {

	static play() {
		const sound = new Howl({
			src: ['/static/audio/intro.wav'],
		})

		sound.play()
	}

	static breapenguin() {
		const sound = new Howl({
			src: ['/static/audio/astronaut_breapenguin.wav'],
		})

		sound.play()
	}

	static music() {
		//const sound = new Howl({
		//	src: ['/static/audio/kristian_space_music.mp3'],
		//})
		//
		//sound.play()
	}
}

