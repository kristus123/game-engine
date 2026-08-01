export class EveryMs {
	constructor(ms, callback) {
		this.i = 0
		this.stopWatch = StopWatch().start()
	}

	update() {
		if (this.stopWatch.moreThan(this.ms)) {
			this.callback(this.i)
			this.i += 1
			this.stopWatch.restart()
		}
	}

}

