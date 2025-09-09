import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/assertions/a.js'; 
import { AudioEngine } from '/static/engine/audio/AudioEngine.js'; 
import { AudioSheet } from '/static/engine/audio/AudioSheet.js'; 

export class Sound {

	static init() {
		this._click = new AudioEngine(G.Audio.click)
		this._placeDirt = new AudioEngine(G.Audio.placeDirt)
	}

	static click() {
		this._click.play()
	}

	static placeDirt() {
		this._placeDirt.play()
	}

	static get nya() {
		return new AudioSheet(G.Audio.nyaSheet)
	}

	static get sheet() {
		return new AudioSheet(G.Audio.sheet)
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

