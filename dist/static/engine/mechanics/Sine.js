import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Sine {
	constructor(amplitude = 100, speed = 0.01) {

				AssertNotNull(amplitude, "argument amplitude in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(speed, "argument speed in " + this.constructor.name + ".js should not be null")
			
		this.amplitude = amplitude; 
		this.speed = speed; 

		this.amplitude = amplitude
		this.speed = speed
		this.angle = 0
		this.value = 0
	}

	update() {
		this.value = Math.sin(this.angle) * this.amplitude
		this.angle += this.speed
		return this.value
	}
}

