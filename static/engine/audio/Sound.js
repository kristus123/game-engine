export class Sound {

	static init() {
		this._click = new AudioEngine(G.Audio.click)
		this._theme = new AudioEngine(G.Audio.theme)
	}

	static theme() {
		this._theme.play()
	}

	static click() {
		this._click.play()
	}

}

