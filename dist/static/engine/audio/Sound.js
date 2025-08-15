import { G } from '/static/engine/G.js'; 
import { Audio } from '/static/engine/audio/Audio.js'; 
import { AudioEngine } from '/static/engine/audio/AudioEngine.js'; 

export class Sound {

	static init() {
		this._click = new AudioEngine(G.Audio.click)
	}

	static click() {
		this._click.play()
	}

}

