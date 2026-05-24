// used for Quest.js

export class Wait {

	constructor(ms, onStart=() => {}) {
		this.s = StopWatch().start()
	}

	done() {
		if (this.s.time > this.ms) {
			onStart()
		}
	}

}
