export class Sound {

	static init() {
		this._click = AudioEngine(G.Audio.click)
		this._placeDirt = AudioEngine(G.Audio.placeDirt)
	}

	static click() {
		// this._click.play()
	}

	static placeDirt() {
		this._placeDirt.play()
	}

	static get nya() {
		return AudioSheet(G.Audio.nyaSheet)
	}

	static get sheet() {
		return AudioSheet(G.Audio.sheet)
	}

	static playBlob(blob) {
	  if (!blob) {
		  throw new Error('no blob present')
		}

	  const url = URL.createObjectURL(blob)
	  const audio = new Audio(url)
	  audio.play()
	}

}

