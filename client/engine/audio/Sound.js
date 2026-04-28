export class Sound {

	static init() {
		this._click = AudioEngine(SoundBlob.click)
		this._placeDirt = AudioEngine(SoundBlob.placeDirt)
	}

	static playBlob(blob) {
		const url = URL.createObjectURL(blob)
		const audio = new Audio(url)

		audio.play()
	}

}
