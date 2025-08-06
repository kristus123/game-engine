export class Sine {
	constructor(amplitude = 100, speed = 0.01) {
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

