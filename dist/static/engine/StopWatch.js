
export class StopWatch {
	constructor() {


		this.startTime = 0
		this.endTime = 0
		this.running = false
		this._elapsedTime = 0

		this.start()
	}

	start() {
		this.startTime = Date.now() - this._elapsedTime
		this.running = true

		return this
	}

	stop() {
		this.endTime = Date.now()
		this._elapsedTime = this.endTime - this.startTime
		this.running = false
		return this
	}

	reset() {
		this.startTime = 0
		this.endTime = 0
		this.running = false
		this._elapsedTime = 0
		return this
	}

	restart() {
		this.reset()
		this.start()
		return this
	}

	get time() { // returns ms
		if (this.running) {
			return Date.now() - this.startTime
		}
		else {
			return this._elapsedTime
		}
	}

	get ms() {
		return this.time
	}

	moreThan(ms) {
		return this.running && this.ms >= ms
	}

	get value() { // returns ms
		return this.time // used in motion
	}

}

