export class Sound {

	static init() {
		this._click = new AudioEngine(G.Audio.click)
	}

	static click() {
		this._click.play()
	}

	static get nya() {
		return new AudioSheet(G.Audio.nyaSheet)
	}

	static get sheet() {
		return new AudioSheet(G.Audio.sheet)
	}

}

