export class StopWatch {
	constructor() {
		this.startTime = 0
		this.endTime = 0
		this.running = false
		this._elapsedTime = 0
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

	get time() {
		if (this.running) {
			return Date.now() - this.startTime
		}
		else {
			return this._elapsedTime
		}
	}

	get value() {
		return this.time // used in motion
	}

}

