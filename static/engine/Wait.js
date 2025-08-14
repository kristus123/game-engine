// used for Quest.js
//
export class Wait {

	constructor(ms, onStart=() => {}) {
		this.s = new StopWatch().start()

		onStart()
	}

	completed() {
		return this.s.time > this.ms
	}

}
