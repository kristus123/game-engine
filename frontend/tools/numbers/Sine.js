export class Sine {
	constructor(start, end, speed = 1) {
		this.time = 0
		this.value = start
	}

	update() {
		this.time += DeltaTime.seconds * this.speed

		const progress = (Math.sin(this.time) + 1) / 2

		this.value = this.start + (this.end - this.start) * progress
	}
}
