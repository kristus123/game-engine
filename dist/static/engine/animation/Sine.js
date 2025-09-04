import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Sine {
	constructor(min = -1, max = 1, speed = 0.01) {

				AssertNotNull(min, "argument min in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(max, "argument max in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(speed, "argument speed in " + this.constructor.name + ".js should not be null")
			
		this.min = min; 
		this.max = max; 
		this.speed = speed; 

		this.min = min
		this.max = max
		this.speed = speed
		this.angle = 0
		this.value = 0
	}

	update() {
		const normalized = (Math.sin(this.angle) + 1) / 2
		this.value = this.min + normalized * (this.max - this.min)
		this.angle += this.speed
		return this.value
	}
}

