export class Wait {

	constructor(ms) {
		this.s = new StopWatch().start()
	}

	completed() {
		return this.s.time > this.ms
	}

}
