import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/assertions/a.js'; 
import { AudioEngine } from '/static/engine/audio/AudioEngine.js'; 
import { AudioSheet } from '/static/engine/audio/AudioSheet.js'; 

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

