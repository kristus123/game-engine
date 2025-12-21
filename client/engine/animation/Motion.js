export class Motion {
	constructor(startValue = 4, end = 1, duration = 400, easing = Easings.bounce) {
		this.value = this.startValue
		this.duration = Math.max(1, duration)
		this.playing = false
	}

	start() {
		this.value = this.startValue
		this.elapsed = new StopWatch().start()
		this.playing = true
	}

	update() {
		if (this.playing) {
			const e = this.elapsed.value

			let progress = Math.min(e / this.duration, 1)

			this.value = this.startValue + (this.end - this.startValue) * this.easing(progress)

			if (progress <= 1) {
				// this.playing = false;
			}
		}
	}
}
