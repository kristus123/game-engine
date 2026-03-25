export class Sound {

	static init() {
		this._click = AudioEngine(G.Sound.click)
		this._placeDirt = AudioEngine(G.Sound.placeDirt)
	}

	static click() {
		// this._click.play()
	}

	static placeDirt() {
		this._placeDirt.play()
	}

	static get nya() {
		return AudioSheet(G.Sound.nyaSheet)
	}

	static get sheet() {
		return AudioSheet(G.Sound.sheet)
	}

	static playBlob(blob) {
		if (!blob) {
			throw new Error("no blob present")
		}
		else {
			const url = URL.createObjectURL(blob)
			const audio = new Audio(url)

			audio.play()
		}
	}

}

