import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/core/position/Position.js'; 

export class Shake {
	constructor(sprite) {

				AssertNotNull(sprite, "argument sprite in " + this.constructor.name + ".js should not be null")
			
		this.sprite = sprite; 

		this.sprite = sprite
		this.time = 0
		this.intensity = 0
		this.offset = { x: 0, y: 0 }
	}

	start(duration = 200, intensity = 2) {
		this.time = duration
		this.intensity = intensity
	}

	update() {
		if (this.time > 0) {
			this.time -= 16 // assume ~60 FPS
			this.offset.x = (Math.random() - 0.5) * this.intensity * 2
			this.offset.y = (Math.random() - 0.5) * this.intensity * 2
		}
		else {
			this.offset.x = 0
			this.offset.y = 0
		}
	}

	getPosition() {
		return {
			x: this.sprite.position.x + this.offset.x,
			y: this.sprite.position.y + this.offset.y,
			width: this.sprite.position.width,
			height: this.sprite.position.height,
		}
	}
}

