export class Sine {
	constructor(min = -1, max = 1, speed = 0.01) {
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

