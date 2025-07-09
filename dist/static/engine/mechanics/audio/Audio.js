
/* eslint-disable no-undef, */ // Ignore Howl import warning




export class Audio {

	static play() {
		const sound = new Howl({
			src: ['/static/audio/intro.wav'],
		})

		sound.play()
	}

	static breathing() {
		const sound = new Howl({
			src: ['/static/audio/astronaut_breathing.wav'],
		})

		sound.play()
	}


	static eat() {
		const sound = new Howl({
			src: ['/static/audio/eat.m4a'],
		})

		sound.play()
	}

	static poop() {
		const sound = new Howl({
			src: ['/static/audio/poop.wav'],
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

