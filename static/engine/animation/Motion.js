export class Motion {
	constructor(elapsedType = () => new StopWatch().start(), startValue = 1, end = 10, duration = 1000, easing = Easings.linear) {
		this.value = this.startValue;
		this.duration = Math.max(1, duration);
		this.playing = false;
	}

	start() {
		this.elapsed = this.elapsedType()
		this.playing = true;
	}

	update() {
		if (this.playing) {
			const e = this.elapsed.value

			let progress = Math.min(e / this.duration, 1);

			this.value = this.startValue + (this.end - this.startValue) * this.easing(progress);

			console.log(progress)
			if (progress <= 1) {
				// this.playing = false;
			}
		}
	}
}
