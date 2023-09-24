export class AudioEngine {
	constructor() {
		const effect1Audio = new Audio()
		effect1Audio.src = 'path-to-your-audio-file.mp3'
	}

	playEffect1() {
		effect1Audio.currentTime = 0 // Reset audio to the beginning
		effect1Audio.play()
	}

	loop() {
		const loopAudio = new Audio()
		loopAudio.src = 'path-to-your-loop-audio.mp3'
		loopAudio.currentTime = 0
		loopAudio.loop = true // Set the loop property to true

		effect1Audio.play()
	}

	stop() {
		audio.pause()
	}
}
