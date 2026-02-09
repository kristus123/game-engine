export class After {
	constructor(intervalMs, action) {
		this.stopWatch = StopWatch().start()
	}

	update() {
		if (this.stopWatch.time > this.intervalMs) {
			this.action()
			this.removeItself()
		}
	}

	draw(draw) {
	}
}
