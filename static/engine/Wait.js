// used for Quest.js
//
export class Wait {

	constructor(ms, onStart=() => {}) {
		this.s = new StopWatch().start()
	}

	completed() {
		if (this.s.time > this.ms) {
			onStart()
		}
	}

}
