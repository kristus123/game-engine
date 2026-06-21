// used for Quest.js

export class Wait {

	constructor(ms, onStart=() => {}) {
		this._done = false
		this.s = StopWatch().start()
	}

	get done() {
		if (this.s.time > this.ms || this._done) {
			this.onStart()
			return true
		}
		else {
			return false
		}
	}

	set done(b) {
		this._done = b
	}

}
