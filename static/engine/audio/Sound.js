export class Sound {

	static init() {
		this._click = new AudioEngine(G.Audio.click)
	}

	static click() {
		this._click.play()
	}

}

