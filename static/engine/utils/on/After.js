export class After {
	constructor(intervalMs, action) {
		this.stopWatch = new StopWatch().start()
	}

	update() {
		if (this.stopWatch.time > this.intervalMs) {
			this.action()
			this.removeFromLoop()
		}
	}

	draw(draw) {
	}
}
